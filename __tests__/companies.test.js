const request = require('supertest');
const app = require('../app');


describe('GET /companies', () => {
    test('Getting a list of companies', async () => {
        const response = await request(app).get('/companies');
        expect(response.statusCode).toBe(200);
    });
});

describe('POST /companies', () => {
    test("Creating a new company", async () => {
        const newCompany = { code: "test", name: "Test Company", description: "Testing if company will be created" };
        const response = await request(app).post("/companies/").send(newCompany);
        expect(response.statusCode).toBe(201);
    });
});

describe("PUT /companies/:code", () => {
    test("Updating a specific company", async () => {
        const updatedData = { name: "Updated Company", description: "Updated Description" };
        const response = await request(app).put("/companies/test").send(updatedData);
        expect(response.statusCode).toBe(200);
        expect(response.body.company).toHaveProperty("name", "Updated Company");
    });
});

describe("DELETE /companies/:code", () => {
    test("Deleting a specific company", async () => {
        const response = await request(app).delete("/companies/test");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: "deleted" });
    });
});

