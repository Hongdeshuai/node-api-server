const jwt = require('jsonwebtoken');
const multer  = require('multer');
const path = require('path');
const request = require('request');

const app = require('../app.js');
const db = require('../db/db_schema.js');
const settings = require('../config/base.js');
const multerConfig = require('../config/multers.js');

const getAccount = require('../db/account');
const handleError = require('../exceptions/handler.js').handleError;
const generatePasswordHash = require('../utils/helper.js').generatePasswordHash;
const verifyPassword = require('../utils/helper.js').verifyPassword;

var cpUpload = multer(multerConfig.studentMulterConfig).fields([{ name: 'resume', maxCount: 1 }, { name: 'transcript', maxCount: 1 }]);


// ------ Endpoint for admin login ------
app.post(settings.api + '/auth/admins/login', function(req, res) {
    var params = req.body;

    getAccount.getAdmin(params.username, function(admin) {
        if (admin) {
            if (!verifyPassword(params.password, admin.password)) {
                return handleError("Bad request", res, 400);
            }

            var token = jwt.sign({"_id": admin._id}, settings.adminTokenSecret, {
                expiresIn: 7 * 86400 //7 days
            });
            res.send({'token': token});
        } else {
            return handleError("Unauthorized", res, 401);
        }
    });
});

// ------ Endpoint for student login ------
app.post(settings.api + '/auth/students/login', function(req, res) {
    var params = req.body;

    getAccount.getStudent(params.username, function(student) {
        if (student) {
            if (!verifyPassword(params.password, student.password)) {
                return handleError("Bad request", res, 400);
            }

            var token = jwt.sign({"_id": student._id}, settings.studentTokenSecret, {
                expiresIn: 7 * 86400 //7 days
            });
            res.send({"token": token});
        } else {
            return handleError("Unauthorized", res, 401);
        }
    });
});

// ------ Endpoint for employer login ------
app.post(settings.api + '/auth/employers/login', function(req, res) {
    var params = req.body;
    getAccount.getEmployer(params.username, function(employer) {
        if (employer) {
            if (!verifyPassword(params.password, employer.password)) {
                return handleError("Bad request", res, 400);
            }

            var token = jwt.sign({"_id": employer._id}, settings.employerTokenSecret, {
                expiresIn: 7 * 86400 //7 days
            });
            res.send({"token":token});
        } else {
            return handleError("Unauthorized", res, 401);
        }
    });
});

// ------ Create student ------
app.post(settings.api + '/auth/students/signup', cpUpload, function(req, res) {
    obj = new db.Student(req.body);
    obj.password = generatePasswordHash(obj.password);
    if (req.files.resume) obj.resume_url = req.files.resume[0].path;
    if (req.files.transcript) {
        obj.transcript_url = req.files.transcript[0].path;
        obj.transcript = req.files.transcript[0].originalname;
    }

    obj.save(function(err) {
        if (err) {
            if (err.message.includes('dup key')) {
                if (err.message.includes('current_email')) {
                    return handleError({'status': 'failed', 'message': "The 'Current Email' is already in use by another user. Please use another email address or contact the system administrator."}, res, 200);
                }
                if (err.message.includes('username')) {
                    return handleError({'status': 'failed', 'message': "The 'User Name' already used by another user. Please use another username or contact the system administrator."}, res, 200);
                }
            }
            return handleError(err, res, 400);
        }
        res.send({'status': 'success'});
    });
});

// ------ Create employer ------
app.post(settings.api + '/auth/employers/signup', function(req, res) {
    req.body.company_name = req.body.company_name.trim();
    req.body.board_link = req.body.board_link.trim();

    var formData = {
        'link': req.body.board_link,
        'id': req.body.company_name
    };
    request.post({url: 'https://ovwymb9ld7.execute-api.us-east-1.amazonaws.com/prod/company/add', formData: formData}, function (err, httpResponse, body) {
        if (err) return handleError(err, res, 500);

        obj = new db.Employer(req.body);
        obj.password = generatePasswordHash(obj.password);

        obj.save(function(err) {
            if (err) {
                if (err.message.includes('dup key')) {
                    if (err.message.includes('email')) {
                        return handleError({'status': 'failed', 'message': "The 'Email' already used by another user. Please use another email address or contact the system administrator."}, res, 200);
                    }
                    if (err.message.includes('username')) {
                        return handleError({'status': 'failed', 'message': "The 'User Name' already used by another user. Please use another username or contact the system administrator."}, res, 200);
                    }
                }
                return handleError(err, res, 400);
            }
            res.send({'status': 'success'});
        });
    });
});
