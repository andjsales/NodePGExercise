# Node PG Exercise

## Description

- A REST-ful backend API server for a simple company/invoice tracker
- Node.js and Express

## Setup

- express and pg via NPM

## How to use?

Starting the server:

- npm start

### Company Routes

GET /companies

- list all companies

GET /companies/[code]

- Retrieve a specific company by its code

POST /companies

- Adding a new company
- Requires JSON input

PUT /companies/[code]

- Updating a company
- Requires JSON input

DELETE /companies/[code]

- Deleting a company

### Invoice Routes

GET /invoices

- Returns a list of all invoices

GET /invoices/[id]

- Retrieves a specific invoice by its ID

POST /invoices

- Adds a new invoice. Requires JSON input

PUT /invoices/[id]

- Updates an existing invoice. Requires JSON input

DELETE /invoices/[id]

- Deletes a specific invoice
