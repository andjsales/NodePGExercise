const express = require('express');
const router = express.Router();
const db = require('../db');
const ExpressError = require("../expressError");
const slugify = require('slugify');

// Returns list of companies
// {companies: [{code, name}, ...]}
router.get('/', async function (req, res, next) {
    try {
        const result = await db.query('SELECT code, name FROM companies');
        return res.json({ companies: result.rows });
    } catch (err) {
        return next(err);
    }
});

// Returns obj of company: {company: {code, name, description}}
// Returns 404 status response if not found
router.get('/companies/:code', async function (req, res, next) {
    try {
        const { code } = req.params;
        const companyRes = await db.query('SELECT code, name, description FROM companies WHERE code = $1', [code]);

        if (companyRes.rows.length === 0) {
            return res.status(404).json({ error: "Company not found" });
        }

        const company = companyRes.rows[0];

        const industriesRes = await db.query('SELECT i.industry FROM industries i JOIN company_industries ci ON i.code = ci.industry_code WHERE ci.company_code = $1', [code]);

        company.industries = industriesRes.rows.map(row => row.industry);

        return res.json({ company: company });
    } catch (err) {
        return next(err);
    }
});

// Adds a company
// Needs to be given JSON like: {code, name, description}
router.post("/", async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const code = slugify(name, { lower: true });
        const result = await db.query(
            `INSERT INTO companies (code, name, description) 
             VALUES ($1, $2, $3) 
             RETURNING code, name, description`,
            [code, name, description]
        );
        return res.status(201).json({ company: result.rows[0] });
    } catch (err) {
        return next(err);
    }
});

// Edit existing company. 
// Should return 404 if company cannot be found.
// Needs to be given JSON like: {name, description} 
// Returns update company object: {company: {code, name, description}}
router.put('/:code', async function (req, res, next) {
    try {
        const { code } = req.params;
        const { name, description } = req.body;
        const checkCompany = await db.query('SELECT * FROM companies WHERE code = $1', [code]);

        if (checkCompany.rows.length === 0) {
            return res.status(404).json({ error: "No company found" });
        }

        const result = await db.query(
            'UPDATE companies SET name = $1, description = $2 WHERE code = $3 RETURNING code, name, description', [name, description, code]
        );
        return res.json({ company: result.rows[0] });
    }
    catch (err) {
        return next(err);
    }
});

// Deletes company. 
// Should return 404 if company cannot be found.
// Returns {status: "deleted"}
router.delete('/:code', async function (req, res, next) {
    try {
        const { code } = req.params;
        const checkCompany = await db.query('SELECT * FROM companies WHERE code = $1', [code]);

        if (checkCompany.rows.length === 0) {
            return res.status(404).json({ error: "No company found" });
        }

        await db.query('DELETE FROM companies WHERE code = $1', [code]);
        return res.json({ status: "deleted" });
    }
    catch (err) {
        return next(err);
    }
});

module.exports = router;
