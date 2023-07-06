const multer  = require('multer');
const fs = require('fs');
const app = require('../app.js');

const db = require('../db/db_schema.js');
const settings = require('../config/base.js');
const validation = require('../config/validation.js');

const multerConfig = require('../config/multers.js');
const handleError = require('../exceptions/handler.js').handleError;

var cpUpload = multer(multerConfig.applicationMulterConfig).fields([{ name: 'w9form', maxCount: 1 }]);
const sendMail = require('../utils/helper.js').sendMail;

// ------ Endpoints ------


// ------ Get all applications from employer------
app.get(settings.api + '/employers/applications', function(req, res) {
    db.Application.find({employer_id: req.employer._id}).exec(function(err, list) {
        if (err) return handleError(err, res, 500);
        res.send(list);
    });
});

// ------ Get application from id from employer------
app.get(settings.api + '/employers/applications/:id', function(req, res) {
    db.Application.findById(req.params.id).exec(function(err, obj) {
        if (err) return handleError(err, res, 404);
        res.send(obj);
    });
});

// ------ Get all applications from admin------
app.get(settings.api + '/admins/applications', function(req, res) {
    var filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    db.Application.find(filter).exec(function(err, list) {
        if (err) return handleError(err, res, 500);
        res.send(list);
    });
});

// ------ Get application from id from admin------
app.get(settings.api + '/admins/applications/:id', function(req, res) {
    db.Application.findById(req.params.id).exec(function(err, obj) {
        if (err) return handleError(err, res, 404);
        res.send(obj);
    });
});

// ------ Create application ------
app.post(settings.api + '/employers/applications', cpUpload, function(req, res) {
    req.body.internship = JSON.parse(req.body.internship);
    req.body.employer = JSON.parse(req.body.employer);

    if (req.body.employer._id !== req.employer._id.toString()) return handleError('Forbidden', res, 403);

    if (req.body.status > 1) {
        if (!req.files.w9form) return handleError('Bad Request', res, 400);

        validation.application.forEach(function(key) {
            if (!req.body[key]) {
                return handleError('Bad Request', res, 400);
            }
        });
    }

    obj = new db.Application(req.body);
    if (req.files.w9form) {
        obj.w9form_url = req.files.w9form[0].path;
    }

    obj.save(function(err) {
        if (err) return handleError(err, res, 500);

        var internship_id = obj.internship._id;
        obj.internship = undefined;
        obj.employer = undefined;

        db.Internship.findByIdAndUpdate(internship_id, {$set: {application: obj}}, function(err, internship) {
            if (err) return handleError(err, res, 500);
            internship.application = obj;
            res.send(internship);
        });
    });
});

// ------ Evaluate application from admin------
app.put(settings.api + '/admins/applications/evaluate', function(req, res) {
    var status = parseInt(req.body.status);
    var denied_comment = req.body.denied_comment ? req.body.denied_comment : undefined;
    var approved_denied_time = new Date();

    db.Application.findByIdAndUpdate(req.body._id, {$set: {status: status, denied_comment: denied_comment, approved_denied_time: approved_denied_time}}, function(err, obj) {
        if (err) return handleError(err, res, 500);
        db.Internship.findByIdAndUpdate(obj.internship._id, {$set: {'application.status': status, 'application.denied_comment': denied_comment, 'application.approved_denied_time': approved_denied_time}}, function(err, internship) {
            if (err) return handleError(err, res, 500);

            // db.Employer.findById(obj.employer._id).exec(function(err, employer) {
            //     var content = '', subject = '';
            //
            //     if (status === 3) {
            //         subject = 'Your application was approved';
            //         content = '<p>Congratulate, your application was approved.</p>';
            //     } else if (status === 4) {
            //         subject = 'Your application was denied';
            //         content = '' +
            //             '<p>Sorry, your application was denied.</p>' +
            //             '<p>Here is the reason:</p>' +
            //             '<p>' + denied_comment + '</p>';
            //     }
            //
            //     sendMail(employer.email, subject, content);
            // });

            obj.status = status;
            obj.denied_comment = denied_comment;
            obj.approved_denied_time = approved_denied_time;
            res.send(obj);
        });
    });
});

// ------ Update application ------
app.put(settings.api + '/employers/applications/:id', cpUpload, function(req, res) {
    req.body.internship = JSON.parse(req.body.internship);
    req.body.employer = JSON.parse(req.body.employer);

    if (req.body.employer._id !== req.employer._id.toString()) return handleError('Forbidden', res, 403);

    db.Application.findById(req.params.id).exec(function(err, obj) {
        if (err) return handleError(err, res, 404);

        if (req.body.status > 1) {
            if (!obj.w9form_url && !req.files.w9form) return handleError('Bad Request', res, 400);

            validation.application.forEach(function(key) {
                if (!req.body[key]) {
                    return handleError('Bad Request', res, 400);
                }
            });
        }

        var old_internship_id = obj.internship._id;
        var new_internship_id = req.body.internship._id;

        obj.set(req.body);

        if (req.files.w9form) {
            if (obj.w9form_url) {
                fs.unlink(obj.w9form_url, function (err) {
                    if (err) throw err;
                    console.log('successfully deleted old W9Form file');
                });
            }

            obj.w9form_url = req.files.w9form[0].path;
        }

        obj.save(function(err) {
            if (err) return handleError(err, res, 500);

            if (old_internship_id !== new_internship_id) {
                db.Internship.findByIdAndUpdate(old_internship_id, {$set: {application: {}}}, function(err, old_internship) {
                    if (err) return handleError(err, res, 500);
                });
            }

            db.Internship.findByIdAndUpdate(new_internship_id, {$set: {application: obj}}, function(err, internship) {
                if (err) return handleError(err, res, 500);
                internship.application = obj;
                res.send(internship);
            });
        });

    });
});

// ------ Delete application ------
app.delete(settings.api + '/employers/applications/:id', function(req, res) {
    db.Application.findOneAndRemove({_id: req.params.id, employer_id: req.employer._id}, function(err) {
        if (err) return handleError(err, res, 500);
        res.send({});
    });
});

// ------ Get count of approved and denied applications from admin------
app.get(settings.api + '/admins/metrics/applications/count', function(req, res) {
    var resp = {};
    db.Application.countDocuments({"status": 3}).exec(function(err, approved_count) {
        if (err) return handleError(err, res, 500);

        db.Application.countDocuments({"status": 4}).exec(function(err, denied_count) {
            if (err) return handleError(err,res, 500);

            resp.approved_count = approved_count;
            resp.denied_count = denied_count;

            res.send(resp);
        });
    });
});

// ------ Get count of registered students from admin------
app.get(settings.api + '/admins/metrics/students/count', function(req, res) {
    var counts = [];
    var current_month = parseInt(req.query.current_month);
    var period = parseInt(req.query.period);
    var now = new Date();

    if (!current_month || !period) {
        return handleError('Bad request', res, 400);
    }

    for (var i = period - 1; i >= 0; i--) {
        var month = current_month - i;
        var start_date = new Date(now.getFullYear(), month, 1, 0, 0, 0);
        var end_date = new Date(now.getFullYear(), month + 1, 1, 0, 0, 0);

        getStudentsCount(res, start_date, end_date, function(count) {
            counts.push(count);
            if (counts.length === period) res.send({"counts": counts});
        });
    }
});

var getStudentsCount = function(res, start_date, end_date, callback) {
    db.Student.countDocuments({"$and": [ {"createdAt": {"$gte": start_date}}, {"createdAt": {"$lt": end_date}} ]}).exec(function(err, count) {
        if (err) return handleError(err, res, 500);
        callback({"month": start_date.getMonth(), "count": count});
    });
};
