const express = require('express');
const router = express.Router();
const db = require('../db');

// Returns list of companies
// {companies: [{code, name}, ...]}
router.get('/companies', async function (req, res, next) {
    try {

        const res = await db.query('SELECT code, name FROM companies');
        return res.json({ companies: result.rows });

    } catch (err) {
        return next(err);
    }
});

// Returns obj of company: {company: {code, name, description}}
// Returns 404 status response if not found
router.get('/companies/:code', async function (req, res, next) {
    try {

        const { code } = req.params;
        const res = await db.query('SELECT code, name, description FROM companies WHERE code = $1', [code]);

        if (res.rows.length === 0) {
            return res.status(404).send({ error: "Company not found" });
        }
        return res.json({ company: res.rows[0] });

    } catch (err) {
        return next(err);
    }
});

// Adds a company
// Needs to be given JSON like: {code, name, description}
router.post('/companies', async function (req, res, next) {
    try {

        const { code, name, description } = req.body;
        const res = await db.query(
            'INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description', [code, name, description]
        );
        return res.status(201).json({ company: res.rows[0] });

    } catch (err) {
        return next(err);
    }
});

// Edit existing company. 
// Should return 404 if company cannot be found.
// Needs to be given JSON like: {name, description} 
// Returns update company object: `{company: {code, name, description}}`
router.put('/companies/:code', async function (req, res, next) {
    try {

        const { code } = req.params;
        const { name, description } = req.body;
        const checkCompany = await db.query('SELECT * FROM companies WHERE code = $1', [code]);

        if (checkCompany.rows.length === 0) {
            return res.status(404).json({ error: "No company found" });
        }

        const result = await db.query(
            'Update companies SET name = $1, description = $2 WHERE code = $3 RETURNING code, name, description', [name, description, code]
        );
        return res.json({ company: result.rows[0] });

    }
    catch (err) {
        return next(err);
    }
});

// Deletes company. 
// Should return 404 if company cannot be found.
// Returns `{status: "deleted"}`
router.delete('/companes/:code', async function (req, res, next) {
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