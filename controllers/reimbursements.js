const multer  = require('multer');
const fs = require('fs');
const app = require('../app.js');
const db = require('../db/db_schema.js');
const settings = require('../config/base.js');
const multerConfig = require('../config/multers.js');
const handleError = require('../exceptions/handler.js').handleError;
const downloadFile = require('../utils/helper.js').downloadFile;

var cpUpload = multer(multerConfig.reimbursementMulterConfig).fields([{ name: 'payroll', maxCount: 1 }]);

// ------ Endpoints ------


// ------ Get all reimbursements from employer------
app.get(settings.api + '/employers/reimbursements', function(req, res) {
    db.Reimbursement.find({'employer._id': req.employer._id}).exec(function(err, list) {
        if (err) return handleError(err, res, 500);
        res.send(list);
    });
});

// ------ Download payroll from id from admin------
app.get(settings.api + '/admins/reimbursements/download/payroll/:id', function(req, res) {
    db.Reimbursement.findById(req.params.id).exec(function(err, obj) {
        if (err) return handleError(err, res, 404);
        downloadFile(obj.payroll_url, obj.payroll, res);
    });
});

// ------ Get reimbursement from id from employer------
app.get(settings.api + '/employers/reimbursements/:id', function(req, res) {
    db.Reimbursement.findById(req.params.id).exec(function(err, obj) {
        print('--------');
        if (err) return handleError(err, res, 404);
        res.send(obj);
    });
});

// ------ Get all reimbursements from admin------
app.get(settings.api + '/admins/reimbursements', function(req, res) {
    var filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    db.Reimbursement.find(filter).exec(function(err, list) {
        if (err) return handleError(err, res, 500);
        res.send(list);
    });
});

// ------ Get reimbursement from id from admin------
app.get(settings.api + '/admins/reimbursements/:id', function(req, res) {
    db.Reimbursement.findOne({ _id: req.params.id }).exec(function(err, obj) {
        if (err) return handleError(err, res, 404);
        res.send(obj);
    });
});

// ------ Create reimbursement ------
app.post(settings.api + '/employers/reimbursements', cpUpload, function(req, res) {
    req.body.internship = JSON.parse(req.body.internship);
    req.body.employer = JSON.parse(req.body.employer);

    if (req.body.employer._id !== req.employer._id.toString()) return handleError('Forbidden', res, 403);
    if (!req.files.payroll) return handleError('Bad Request', res, 400);

    obj = new db.Reimbursement(req.body);
    obj.payroll_url = req.files.payroll[0].path;
    obj.payroll = req.files.payroll[0].originalname;

    obj.save(function(err) {
        if (err) return handleError(err, res, 500);
        var internship_id = obj.internship._id;
        obj.internship = undefined;
        obj.employer = undefined;

        db.Internship.findByIdAndUpdate(internship_id, {$set: {reimbursement: obj}}, function(err, internship) {
            if (err) return handleError(err, res, 500);
            internship.reimbursement = obj;
            res.send(internship);
        });
    });
});

// ------ Evaluate reimbursement from admin------
app.put(settings.api + '/admins/reimbursements/evaluate', function(req, res) {
    var status = req.body.status;
    var denied_comment = req.body.denied_comment ? req.body.denied_comment : undefined;
    var approved_denied_time = new Date();

    db.Reimbursement.findByIdAndUpdate(req.body._id, {$set: {status: status, denied_comment: denied_comment, approved_denied_time: approved_denied_time}}, function(err, obj) {
        if (err) return handleError(err, res, 500);
        db.Internship.findByIdAndUpdate(obj.internship._id, {$set: {'reimbursement.status': status, 'reimbursement.approved_denied_time': approved_denied_time}}, function(err, internship) {
            if (err) return handleError(err, res, 500);
            obj.status = status;
            obj.denied_comment = denied_comment;
            obj.approved_denied_time = approved_denied_time;
            res.send(obj);
        });
    });
});

// ------ Update reimbursement ------
app.put(settings.api + '/employers/reimbursements/:id', cpUpload, function(req, res) {
    req.body.internship = JSON.parse(req.body.internship);
    req.body.employer = JSON.parse(req.body.employer);
    if (req.body.employer._id !== req.employer._id.toString()) return handleError('Forbidden', res, 403);

    db.Reimbursement.findByIdAndUpdate(req.params.id, req.body, { 'new': true }, function(err, obj) {
        if (err) return handleError(err, res, 500);

        if (req.files.payroll) {
            fs.unlink(obj.payroll_url, function (err) {
                if (err) throw err;
                console.log('successfully deleted old PAYROLL file');
            });
            obj.payroll_url = req.files.payroll[0].path;
            obj.payroll = req.files.payroll[0].originalname;
        }

        obj.save(function(err) {
            if (err) return handleError(err, res, 500);
            var internship_id = obj.internship._id;
            obj.internship = undefined;
            obj.employer = undefined;
            db.Internship.findByIdAndUpdate(internship_id, {$set: {reimbursement: obj}}, function(err, internship) {
                if (err) return handleError(err, res, 500);
                internship.reimbursement = obj;
                res.send(internship);
            });
        });
    });
});

// ------ Delete reimbursement ------
app.delete(settings.api + '/employers/reimbursements/:id', function(req, res) {
    db.Reimbursement.findOneAndRemove({_id: req.params.id, 'employer._id': req.employer._id}, function(err) {
        if (err) return handleError(err, res, 500);
        res.send({});
    });
});
