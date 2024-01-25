const request = require('supertest');
const app = require('../app');
let id = undefined;

describe('GET /invoices', () => {
    test('Getting the list of invoices', async () => {
        const response = await request(app).get('/invoices');
        expect(response.statusCode).toBe(200);
    });
});

describe('POST /invoices', () => {
    test('Creating a new invoice', async () => {
        const newInvoice = { comp_code: 'ibm', amt: 300 };
        const response = await request(app).post('/invoices').send(newInvoice);
        id = response['_body']['invoice']['id'];
        expect(response.statusCode).toBe(201);
    });
});

describe('GET /invoices/:id', () => {
    test('Getting a specific invoice', async () => {
        const response = await request(app).get(`/invoices/${id}`);
        expect(response.statusCode).toBe(200);
    });
});


describe('PUT /invoices/:id', () => {
    test('Updating a specific invoice', async () => {
        const updatedInvoice = {
            amt: 500, paid: true
        };
        const response = await request(app).put(`/invoices/${id}`).send(updatedInvoice);
        expect(response.statusCode).toBe(200);
    });
});

describe('DELETE /invoices/:id', () => {
    test('Deleting a specific invoice', async () => {
        const response = await request(app).delete(`/invoices/${id}`);
        expect(response.statusCode).toBe(200);
    });
});
