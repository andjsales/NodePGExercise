const request = require('supertest');
const app = require('../app');
const uuid = require('uuid');
let companyCode;

describe('GET /companies', () => {
    test('Getting a list of companies', async () => {
        const response = await request(app).get('/companies');
        expect(response.statusCode).toBe(200);
    });
});

describe('POST /companies', () => {
    const uniqueSuffix = uuid.v4();
    const companyName = `New Test Company ${uniqueSuffix}`;

    test("Creating a new company", async () => {
        const newCompany = { name: companyName, description: "Testing if company will be created" };
        const response = await request(app).post("/companies").send(newCompany);

        companyCode = response.body.company.code;

        expect(response.statusCode).toBe(201);
    });
});

describe("PUT /companies/:code", () => {
    test("Updating a specific company", async () => {
        const updatedData = { name: `Updated Company ${uuid.v4()}`, description: "Updated Description" };
        const response = await request(app).put(`/companies/${companyCode}`).send(updatedData);

        expect(response.statusCode).toBe(200);
        expect(response.body.company).toHaveProperty("name", updatedData.name);
    });
});

describe("DELETE /companies/:code", () => {
    test("Deleting a specific company", async () => {
        const response = await request(app).delete(`/companies/${companyCode}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: "deleted" });
    });
});

afterAll(async () => {
    if (companyCode) {
        await request(app).delete(`/companies/${companyCode}`);
    }
});
