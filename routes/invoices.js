const express = require('express');
const router = express.Router();
const db = require('../db');
const ExpressError = require("../expressError");


// Return info on invoices
// `{invoices: [{id, comp_code}, ...]}`
router.get('/', async function (req, res, next) {
    try {

        const result = await db.query('SELECT id, comp_code FROM invoices');
        return res.json({ invoices: result.rows });
    }

    catch (err) {
        return next(err);
    }
});

// Returns obj on given invoice.
// If invoice cannot be found, returns 404. 
// Returns `{invoice: {id, amt, paid, add_date, paid_date, company: {code, name, description}}}`
router.get('/:id', async function (req, res, next) {
    try {

        const { id } = req.params;
        const invoiceResult = await db.query('SELECT id, amt, paid, add_date, paid_date, comp_code FROM invoices WHERE id = $1', [id]);

        if (invoiceResult.rows.length === 0) {
            return res.status(404).json({ error: "No invoice found" });
        }

        const invoice = invoiceResult.rows[0];
        const companyResult = await db.query('SELECT code, name, description FROM companies WHERE code = $1', [invoice.comp_code]);

        invoice.company = companyResult.rows[0];
        return res.json({ invoice: invoice });
    }

    catch (err) {
        return next(err);
    }
});

// Adds an invoice. 
// Needs to be passed in JSON body of: `{comp_code, amt}`
// Returns: `{invoice: {id, comp_code, amt, paid, add_date, paid_date}}`
router.post('/', async function (req, res, next) {
    try {

        const { comp_code, amt } = req.body;
        const result = await db.query(
            'INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date', [comp_code, amt]
        );
        return res.status(201).json({ invoice: result.rows[0] });
    }

    catch (err) {
        return next(err);
    }
});

// Updates an invoice. 
// If invoice cannot be found, returns a 404.
// Needs to be passed in a JSON body of `{amt}` 
// Returns: `{invoice: {id, comp_code, amt, paid, add_date, paid_date}}`
router.put(':id', async function (req, res, next) {
    try {

        const { id } = req.params;
        const { amt } = req.body;

        // checking if invoice exists
        const checkInvoice = await db.query('SELECT * FROM invoices WHERE id = $1', [id]);
        if (checkInvoice.rows.length === 0) {
            return res.status(404).json({ error: "No Invoice found" });
        }
        const result = await db.query('UPDATE invoices SET amt = $1 WHERE id = $2 RETURNING id, comp_code, amt, paid, add_date, paid_date', [amt, id]);

        return res.json({ invoice: result.rows[0] });
    }

    catch (err) {
        return next(err);
    }
});

// Deletes an invoice.
// If invoice cannot be found, returns a 404. 
// Returns: {status: "deleted"} Also, one route from the previous part should be updated
router.delete('/:id', async (req, res, next) => {
    try {

        const { id } = req.params;
        // checking if invoice exists
        const checkInvoice = await db.query('SELECT * FROM invoices WHERE id = $1', [id]);
        if (checkInvoice.rows.length === 0) {
            return res.status(404).json({ error: "No invoice found" });
        }

        await db.query('DELETE FROM invoices WHERE id = $1', [id]);
        return res.json({ status: "deleted" });

    } catch (err) {
        return next(err);
    }
});

// Return obj of company: {company: {code, name, description, invoices: [id, ...]}} 
// If the company given cannot be found, this should return a 404 status response
router.get('/:code', async (req, res, next) => {
    try {

        const { code } = req.params;
        // finding the company query
        const companyRes = await db.query(
            'SELECT code, name, description FROM companies WHERE code = $1',
            [code]
        );

        if (companyRes.rows.length === 0) {
            return res.status(404).json({ error: "Company not found" });
        }

        const company = companyRes.rows[0];
        // finding related invoices query
        const invoiceRes = await db.query(
            'SELECT id FROM invoices WHERE comp_code = $1',
            [code]
        );
        company.invoices = invoiceRes.rows.map(inv => inv.id);
        return res.json({ company: company });

    } catch (err) {
        return next(err);
    }
});


module.exports = router;