const express = require('express');
const router = express.Router();
const db = require('../db');
const ExpressError = require("../expressError");


// list all industries
router.get('/', async function (req, res, next) {
    try {
        const result = await db.query('SELECT i.code, i.industry, ARRAY_AGG(ci.company_code) AS companies FROM industries i LEFT JOIN company_industries ci ON i.code = ci.industry_code GROUP BY i.code');
        return res.json({ industries: result.rows });
    } catch (err) {
        return next(err);
    }
});

// add an industry
router.post('/', async function (req, res, next) {
    try {
        const { code, industry } = req.body;
        const result = await db.query('INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING code, industry', [code, industry]);
        return res.status(201).json({ industry: result.rows[0] });
    } catch (err) {
        return next(err);
    }
});

// associate an industry to a company
router.post('/company_industries', async function (req, res, next) {
    try {
        const { company_code, industry_code } = req.body;
        await db.query('INSERT INTO company_industries (company_code, industry_code) VALUES ($1, $2)', [company_code, industry_code]);
        return res.status(201).json({ message: "Industry added to company" });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;