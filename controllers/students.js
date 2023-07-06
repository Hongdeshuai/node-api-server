const multer  = require('multer');
const fs = require('fs');
const path = require('path');
const app = require('../app.js');
const db = require('../db/db_schema.js');
const settings = require('../config/base.js');
const multerConfig = require('../config/multers.js');
const handleError = require('../exceptions/handler.js').handleError;
const generatePasswordHash = require('../utils/helper.js').generatePasswordHash;
const verifyPassword = require('../utils/helper.js').verifyPassword;
const downloadFile = require('../utils/helper.js').downloadFile;


var cpUpload = multer(multerConfig.studentMulterConfig).fields([{ name: 'resume', maxCount: 1 }, { name: 'transcript', maxCount: 1 }]);


// ------ Endpoints ------


// ------ Get student by token ------
app.get(settings.api + '/students/me', function(req, res) {
    var student = req.student;
    student.password = undefined;
    res.send(student);
});

// ------ Get all students ------
app.get(settings.api + '/students/', function(req, res) {
    db.Student.find().select('-password').exec(function(err, list) {
        if (err) return handleError(err, res, 500);
        res.send(list);
    });
});

// ------ Download transcript from id from student------
app.get(settings.api + '/students/download/transcript/:id', function(req, res) {
    db.Student.findOne({ _id: req.params.id }).select('-password').exec(function(err, obj) {
        if (err) return handleError(err, res, 404);
        downloadFile(obj.transcript_url, obj.transcript, res);
    });
});

// ------ Get student from id ------
app.get(settings.api + '/students/:id', function(req, res) {
    db.Student.findOne({ _id: req.params.id }).select('-password').exec(function(err, obj) {
        if (err) return handleError(err, res, 404);
        res.send(obj);
    });
});

// ------ Get student from id from employer ------
app.get(settings.api + '/employers/students/:id', function(req, res) {
    db.Student.findOne({ _id: req.params.id }).select('-password').exec(function(err, obj) {
        if (err) return handleError(err, res, 404);
        res.send(obj);
    });
});

// ------ Get student from id from admin ------
app.get(settings.api + '/admins/students/:id', function(req, res) {
    db.Student.findOne({ _id: req.params.id }).select('-password').exec(function(err, obj) {
        if (err) return handleError(err, res, 404);
        res.send(obj);
    });
});

// ------ Update student ------
app.put(settings.api + '/students/:id', cpUpload, function(req, res) {

    delete req.body.createdAt;

    db.Student.findByIdAndUpdate(req.params.id, req.body, { 'new': true }, function(err, obj) {
        if (err) return handleError(err, res, 500);

        if (req.files.resume) {
            if (obj.resume_url) {
                fs.unlink(obj.resume_url, function (err) {
                    if (err) throw err;
                    console.log('successfully deleted old resume file');
                });
            }
            obj.resume_url = req.files.resume[0].path;
        }

        if (req.files.transcript) {
            if (obj.transcript_url) {
                fs.unlink(obj.transcript_url, function (err) {
                    if (err) throw err;
                    console.log('successfully deleted old transcript file');
                });
            }
            obj.transcript_url = req.files.transcript[0].path;
            obj.transcript = req.files.transcript[0].originalname;
        }

        obj.save(function(err) {
            if (err) return handleError(err, res, 500);
            res.send(obj);
        });
    });
});

// ------ Delete student ------
app.delete(settings.api + '/students/:id', function(req, res) {
    db.Student.findByIdAndRemove(req.params.id, function(err) {
        if (err) return handleError(err, res, 500);
        res.send({});
    });
});

// ------ Change student password ------
app.post(settings.api + '/students/:id/password/change', function(req, res) {
    db.Student.findOne({ username: req.student.username}).exec(function(err, student) {
        if (err) return handleError(err, res);
        if (!student) return handleError("Not found error", res, 404);
        if (!verifyPassword(req.body.password_old, student.password)) return handleError('Password is incorrect', res, 400);
        
        db.Student.findByIdAndUpdate(req.params.id, {
            password: generatePasswordHash(req.body.password_new)
        }, { 'new': true }, function(err, obj) {
            if (err) return handleError(err, res, 500);
            res.send({success: true});
        });
    });
});
