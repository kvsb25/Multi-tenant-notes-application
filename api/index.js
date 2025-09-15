require('dotenv').config();
const serverless = require('serverless-http');
const app = require('../server/server.js'); // import your Express app
module.exports = serverless(app);