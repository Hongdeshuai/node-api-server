const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const createAdmin = require('../db/account.js').createAdmin;
var db_model = require('./db_connection.js');

// Import models
var models = require('./models/index.js');
models.admin.plugin(timestamps);
models.student.plugin(timestamps);
models.employer.plugin(timestamps);
models.hiredata.plugin(timestamps);
models.application.plugin(timestamps);
models.reimbursement.plugin(timestamps);


// Declare mongoose models
const db = [];
db.Admin = db_model.connection.model('Admin', models.admin);
db.Student = db_model.connection.model('Student', models.student);
db.Employer = db_model.connection.model('Employer', models.employer);
db.Internship = db_model.connection.model('Internship', models.internship);
db.HireData = db_model.connection.model('HireData', models.hiredata);
db.Application = db_model.connection.model('Application', models.application);
db.Reimbursement = db_model.connection.model('Reimbursement', models.reimbursement);

module.exports = db;

// Create admin if does not exist
createAdmin();
