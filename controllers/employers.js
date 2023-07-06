const app = require('../app.js');
const db = require('../db/db_schema.js');
const settings = require('../config/base.js');

const handleError = require('../exceptions/handler.js').handleError;
const generatePasswordHash = require('../utils/helper.js').generatePasswordHash;
const verifyPassword = require('../utils/helper.js').verifyPassword;


// ------ Endpoints ------

// ------ Get employer by token ------
app.get(settings.api + '/employers/me', function(req, res) {
    var employer = req.employer;
    employer.password = undefined;
    res.send(employer);
});

// ------ Get all employers ------
app.get(settings.api + '/employers/', function(req, res) {
    db.Employer.find().select('-password').exec(function(err, list) {
        if (err) return handleError(err, res, 500);
        res.send(list);
    });
});

// ------ Get employer from id ------
app.get(settings.api + '/employers/:id', function(req, res) {
    db.Employer.findOne({ _id: req.params.id }).select('-password').exec(function(err, obj) {
        if (err) return handleError(err, res, 404);
        res.send(obj);
    });
});

// ------ Get employer from id from admin ------
app.get(settings.api + '/admins/employers/:id', function(req, res) {
    db.Employer.findOne({ _id: req.params.id }).select('-password').exec(function(err, obj) {
        if (err) return handleError(err, res, 404);
        res.send(obj);
    });
});

// ------ Update employer ------
app.put(settings.api + '/employers/:id', function(req, res) {
    db.Employer.findByIdAndUpdate(req.params.id, req.body, { 'new': true }, function(err, obj) {
        if (err) return handleError(err, res, 500);

        db.Internship.updateMany({"employer._id": req.params.id}, {"$set": {"employer": obj}}).exec(function(err) {
            if (err) return handleError(err, res, 500);
            res.send(obj);
        });
    });
});

// ------ Delete employer ------
app.delete(settings.api + '/employers/:id', function(req, res) {
    db.Employer.findByIdAndRemove(req.params.id, function(err) {
        if (err) return handleError(err, res, 500);
        res.send({});
    });
});

// ------ Change employer password ------
app.post(settings.api + '/employers/:id/password/change', function(req, res) {

    db.Employer.findOne({ username: req.employer.username}).exec(function(err, employer) {
        if (err) return handleError(err, res);
        if (!employer) return handleError("Not found error", res, 404);
        if (!verifyPassword(req.body.password_old, employer.password)) return handleError('Password is incorrect', res, 400);

        db.Employer.findByIdAndUpdate(req.params.id, {
            password: generatePasswordHash(req.body.password_new)
        }, { 'new': true }, function(err, obj) {
            if (err) return handleError(err, res, 500);
            res.send({success: true});
        });
    });

});
