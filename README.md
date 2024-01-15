# Node PG Exercise

## Description

- A REST-ful backend API server for a simple company/invoice tracker
- Node.js and Express

## Setup

- express and pg via NPM

## How to use?

### Companies

Starting the server:
- npm start

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

### Invoices
