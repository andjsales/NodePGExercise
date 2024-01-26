const request = require('supertest');
const app = require('../app');
const slugify = require('slugify'); // Import slugify

describe('GET /companies', () => {
    test('Getting a list of companies', async () => {
        const response = await request(app).get('/companies');
        expect(response.statusCode).toBe(200);
    });
});

describe('POST /companies', () => {
    const uniqueSuffix = new Date().getTime(); // Current timestamp as a unique suffix
    const companyName = `New Test Company ${uniqueSuffix}`; // Ensure unique company name
    const companySlug = slugify(companyName, { lower: true });

    test("Creating a new company", async () => {
        const newCompany = { name: companyName, description: "Testing if company will be created" };
        const response = await request(app).post("/companies").send(newCompany);

        expect(response.statusCode).toBe(201);
        expect(response.body.company.code).toBe(companySlug); // Verify the code is as expected
    });
});

describe("PUT /companies/:code", () => {
    let companyCode; // Variable to hold dynamically created company code

    // Setup step to create a company for testing
    beforeEach(async () => {
        const uniqueSuffix = new Date().getTime(); // Ensure unique name for each test run
        const newCompany = { name: `Test Company ${uniqueSuffix}`, description: "Temporary company for PUT test" };
        const response = await request(app).post("/companies").send(newCompany);
        companyCode = response.body.company.code; // Store the company code for use in the test
    });

    // Teardown step to clean up after the test
    afterEach(async () => {
        await request(app).delete(`/companies/${companyCode}`);
    });

    test("Updating a specific company", async () => {
        const updatedData = { name: "Updated Company", description: "Updated Description" };
        const response = await request(app).put(`/companies/${companyCode}`).send(updatedData);

        expect(response.statusCode).toBe(200);
        expect(response.body.company).toHaveProperty("name", "Updated Company");
    });
});

describe("DELETE /companies/:code", () => {
    let companyCode; // Variable to hold dynamically created company code

    // Setup step to create a company for testing
    beforeEach(async () => {
        const uniqueSuffix = new Date().getTime(); // Ensure unique name for each test run
        const newCompany = { name: `Company for DELETE Test ${uniqueSuffix}`, description: "Temporary company for DELETE test" };
        const response = await request(app).post("/companies").send(newCompany);
        companyCode = response.body.company.code; // Store the company code for use in the test
    });

    test("Deleting a specific company", async () => {
        const response = await request(app).delete(`/companies/${companyCode}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: "deleted" });
    });
});
