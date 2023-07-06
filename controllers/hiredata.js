const app = require('../app.js');
const db = require('../db/db_schema.js');
const settings = require('../config/base.js');

const handleError = require('../exceptions/handler.js').handleError;


// ------ Endpoints ------


// ------ Get all hire data from student------
app.get(settings.api + '/students/hiredata', function(req, res) {
    db.HireData.find({student_id: req.student._id}).exec(function(err, list) {
        if (err) return handleError(err, res, 500);
        res.send(list);
    });
});

// ------ Get hire data from id from student------
app.get(settings.api + '/students/hiredata/:id', function(req, res) {
    if (req.params.id !== req.student._id) return handleError('Forbidden', res, 403);

    db.HireData.findOne({ _id: req.params.id }).exec(function(err, obj) {
        if (err) return handleError(err, res, 404);
        res.send(obj);
    });
});

// ------ Create hire data ------
app.post(settings.api + '/students/hiredata', function(req, res) {
    if (req.body.student_id !== req.student._id.toString()) return handleError('Forbidden', res, 403);

    obj = new db.HireData(req.body);
    obj.save(function(err) {
        if (err) return handleError(err, res, 500);
        var internship_id = obj.internship._id;
        obj.internship = undefined;

        db.Internship.findByIdAndUpdate(internship_id, {$set: {hire_data: obj}}, function(err, internship) {
            if (err) return handleError(err, res, 500);
            res.send(obj);
        });
    });
});

// ------ Update hire data ------
app.put(settings.api + '/students/hiredata/:id', function(req, res) {
    if (req.body.student_id !== req.student._id) return handleError('Forbidden', res, 403);

    db.HireData.findByIdAndUpdate(req.params.id, req.body, { 'new': true }, function(err, obj) {
        if (err) return handleError(err, res, 500);
        var internship_id = obj.internship._id;
        obj.internship = undefined;

        db.Internship.findByIdAndUpdate(internship_id, {$set: {hire_data: obj}}, function(err, internship) {
            if (err) return handleError(err, res, 500);
            res.send(obj);
        });
    });
});

// ------ Delete hire data ------
app.delete(settings.api + '/students/hiredata/:id', function(req, res) {
    db.HireData.findOneAndRemove({_id: req.params.id, student_id: req.student._id}, function(err) {
        if (err) return handleError(err, res, 500);
        res.send({});
    });
});
