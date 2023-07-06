// ------ import settings
const settings = require('./config/base.js');

// import libraries
const logger = require('./logger.js');
const express = require('express');
const app = module.exports = express();
const mongoose = require('mongoose');
const extend = require('extend');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

console.log("\r\n\r\n----------------------------------------------------------------------\r\n\r\n");


if (!fs.existsSync(settings.publicPath)) fs.mkdirSync(settings.publicPath);
if (!fs.existsSync(settings.studentPublicPath)) fs.mkdirSync(settings.studentPublicPath);
if (!fs.existsSync(settings.applicationPublicPath)) fs.mkdirSync(settings.applicationPublicPath);
if (!fs.existsSync(settings.reimbursementPublicPath)) fs.mkdirSync(settings.reimbursementPublicPath);

// ------ import db ------
require('./db/db_connection.js');

// ------ add parse ------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ------ import middleware ------
require('./middleware/security.js');

// ------ start application ------
const server = http.Server(app);
app.use(express.static(settings.publicPath));

// ------ configuration cors ------
app.use(cors({
    origin: ['http://localhost:4200', 'https://ovwymb9ld7.execute-api.us-east-1.amazonaws.com'],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true
}));

server.listen(settings.port, function() {
    logger.info('Server started on port ' + settings.port);
});
