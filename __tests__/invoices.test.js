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
        const response = await request(app).get('/invoices/2');
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
        const updatedInvoice = { amt: 500 };
        const response = await request(app).put('/invoices/2').send(updatedInvoice);
        expect(response.statusCode).toBe(200);
    });
});

describe('DELETE /invoices/:id', () => {
    test('Deleting a specific invoice', async () => {
        const response = await request(app).delete('/invoices/2');
        expect(response.statusCode).toBe(200);
    });
});
