'use strict';

const dotenv = require('dotenv');
const mysql = require('mysql');
let connection = null;
dotenv.config();

try {
  connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    multipleStatements: true
  });
  console.log(`Database connection to Database was successful`);
} catch (e) {
  console.log(`Database connection to Database has failed`);
  console.error(e);
}

module.exports = { connection };
