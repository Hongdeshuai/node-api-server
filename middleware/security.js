const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../app.js');
const logger = require('../logger.js');
const settings = require('../config/base.js');
const getAccount = require('../db/account.js');
const handleError = require('../exceptions/handler.js').handleError;

// ------ import db ------
require('../db/db_connection.js');

// ------ This middleware executes security check for eash request ------

app.all(settings.api + '/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,user,pass,token");

    var prefix = req.url.toLowerCase().split('/')[2];

    if (['admins', 'students', 'employers'].indexOf(prefix) === -1) {
        next();
    } else {
        var token = req.headers.authorization && req.headers.authorization.replace("Bearer ", "");
        if (!token) {
            token = req.query.token;
        }

        if (!token) {
            logger.info("No Token Provided");
            return handleError('Unauthorized', res, 401);
        } else {
            switch (prefix) {
                case 'admins':
                    jwt.verify(token, settings.adminTokenSecret, function(err, decodedAdmin) {
                        if (err) {
                            logger.info(token + " Token is not valid");
                            logger.error(err);
                            return handleError(err, res, 401);
                        } else {
                            getAccount.getAdminById(decodedAdmin._id, function(admin) {
                                req.admin = admin;
                                next();
                            });
                        }
                    });
                    break;
                case 'students':
                    jwt.verify(token, settings.studentTokenSecret, function(err, decodedStudent) {
                        if (err) {
                            logger.info(token + " Token is not valid");
                            logger.error(err);
                            return handleError(err, res, 401);
                        } else {
                            getAccount.getStudentById(decodedStudent._id, function(student) {
                                req.student = student;
                                next();
                            });
                        }
                    });
                    break;
                case 'employers':
                    jwt.verify(token, settings.employerTokenSecret, function(err, decodedEmployer) {
                        if (err) {
                            // Token not valid
                            logger.info(token + " Token is not valid");
                            logger.error(err);
                            return handleError(err, res, 401);
                        } else {
                            getAccount.getEmployerById(decodedEmployer._id, function(employer) {
                                req.employer = employer;
                                next();
                            });
                        }
                    });
                    break;
                default:
                    break;
            }
        }
    }
});
