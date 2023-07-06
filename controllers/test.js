const nodemailer = require('nodemailer');
const app = require('../app.js');
const db = require('../db/db_schema.js');
const settings = require('../config/base.js');

const handleError = require('../exceptions/handler.js').handleError;
const generatePasswordHash = require('../utils/helper.js').generatePasswordHash;
const verifyPassword = require('../utils/helper.js').verifyPassword;
const downloadFile = require('../utils/helper.js').downloadFile;


// ------ Endpoints ------


// ------ Test get api ------
app.get(settings.api + '/test', function(req, res) {

});

// ------ Test post api ------
app.post(settings.api + '/test', function(req, res) {

});
