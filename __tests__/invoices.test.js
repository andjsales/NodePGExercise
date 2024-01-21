const request = require('supertest');
const app = require('../app');

describe('GET /invoices', () => {
    test('Getting the list of invoices', async () => {
        const response = await request(app).get('/invoices');
        expect(response.statusCode).toBe(200);
    });
});

describe('GET /invoices/:id', () => {
    test('Getting a specific invoice', async () => {
        const response = await request(app).get('/invoices/4');
        expect(response.statusCode).toBe(200);
    });
});

describe('POST /invoices', () => {
    test('Creating a new invoice', async () => {
        const newInvoice = { comp_code: 'ibm', amt: 300 };
        const response = await request(app).post('/invoices').send(newInvoice);
        expect(response.statusCode).toBe(201);
    });
});

describe('PUT /invoices/:id', () => {
    test('Updating a specific invoice', async () => {
        // Assuming 1 is a valid invoice ID in your test database
        const updatedInvoice = { amt: 500 };
        const response = await request(app).put('/invoices/4').send(updatedInvoice);
        expect(response.statusCode).toBe(200);
        // Additional assertions can be added here
    });
});

describe('DELETE /invoices/:id', () => {
    test('Deleting a specific invoice', async () => {
        // Assuming 1 is a valid invoice ID in your test database
        const response = await request(app).delete('/invoices/4');
        expect(response.statusCode).toBe(200);
        // Additional assertions can be added here
    });
});
