'use strict';

const routes = require('./routes');
const dotenv = require('dotenv');
const database = require('./database');
const connection = database.connection;
const PORT = process.env.APP_PORT;
dotenv.config();

routes.listen(PORT, () => {
  console.log(`Server is running at PORT: ${PORT}`);
  console.log(`Database is ${connection === null ? 'NOT ' : ''}available`);
});