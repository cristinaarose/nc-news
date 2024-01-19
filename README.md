# Northcoders News API

Hosted app : https://news-app-n80t.onrender.com

This project allows people to view articles, sort and query articles based on what they want to view.

To install dependencies:

DOTENV (module that loads environment variables from a .env file into process.env) run:

     npm i dotenv

EXPRESS (web framework for node.js) run:

    npm i express

JEST-SORTED (extends jest to allow 2 extra custom matcher used for sorting) run :

    npm i jest-sorted

PG (non-blocking PostgresSQL cient for node.js) run:

    npm i pg

To run these databases locally: after installing dotenv and create two files, .env.test and .env.development containing the database names to successfully connect the two databases locally. Run "npm run setup-dbs"

To seed the databases: run "npm run seed"

To run the test file using jest: run "npm run test"

Minimum versions required:

- node.js = v20.6.1
- postgres = ^8.7.3"
