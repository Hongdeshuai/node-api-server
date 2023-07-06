const app = require('../app.js');
const db = require('../db/db_schema.js');
const settings = require('../config/base.js');

const handleError = require('../exceptions/handler.js').handleError;
const generatePasswordHash = require('../utils/helper.js').generatePasswordHash;
const verifyPassword = require('../utils/helper.js').verifyPassword;


// ------ Endpoints ------


// ------ Get admin by token ------
app.get(settings.api + '/admins/me', function(req, res) {
    var admin = req.admin;
    admin.password = undefined;
    res.send(admin);
});

// ------ Get statistical data from admin ------
app.get(settings.api + '/admins/metrics/general', function(req, res) {
    var resp = {};
    const cities = [
        ['us-md-047', 'Worcester'],
        ['us-md-039', 'Somerset'],
        ['us-md-037', 'St.Mary`s'],
        ['us-md-019', 'Dorchester'],
        ['us-md-027', 'Howard'],
        ['us-md-021', 'Frederick'],
        ['us-md-031', 'Montgomery'],
        ['us-md-023', 'Garrett'],
        ['us-md-003', 'Anne Arundel'],
        ['us-md-033', 'Prince George`s'],
        ['us-md-017', 'Charles'],
        ['us-md-510', 'Baltimore'],
        ['us-md-005', 'Baltimore'],
        ['us-md-001', 'Allegany'],
        ['us-md-043', 'Washington'],
        ['us-md-035', 'QueenAnne`s'],
        ['us-md-041', 'Talbot'],
        ['us-md-011', 'Caroline'],
        ['us-md-045', 'Wicomico'],
        ['us-md-013', 'Carroll'],
        ['us-md-015', 'Cecil'],
        ['us-md-029', 'Kent'],
        ['us-md-009', 'Calvert'],
        ['us-md-025', 'Harford']
    ];
    var counter = 0;

    for (var i = 0; i < cities.length; i++) {
        resp[cities[i][0]] = {};
        resp[cities[i][0]].key = cities[i][0];
        resp[cities[i][0]].city = cities[i][1];

        getInternshipCountByCity(res, cities[i], function(data) {
            counter++;
            resp[data[0]].internship = data[2];
            checkFinish();
        });

        getEmployerCountByCity(res, cities[i], function (data) {
            counter++;
            resp[data[0]].employer = data[2];
            checkFinish();
        });

        getStudentCountByCity(res, cities[i], function (data) {
            counter++;
            resp[data[0]].student = data[2];
            checkFinish();
        });
    }

    function checkFinish() {
        if (counter === 3 * cities.length) {
            var data = [];
            for (const key of Object.keys(resp)) {
                data.push(resp[key]);
            }
            res.send({"data": data});
        }
    }
});

// ------ Get all admins ------
app.get(settings.api + '/admins/', function(req, res) {
    db.Admin.find().exec(function(err, list) {
        if (err) return handleError(err, res, 500);
        res.send(list);
    });
});

// ------ Get admin from id ------
app.get(settings.api + '/admins/:id', function(req, res) {
    db.Admin.findOne({ _id: req.params.id }).exec(function(err, obj) {
        if (err) return handleError(err, res, 404);
        res.send(obj);
    });
});

// ------ Create admin ------
app.post(settings.api + '/admins/', function(req, res) {
    obj = new db.Admin(req.body);
    obj.password = generatePasswordHash(obj.password);
    obj.save(function(err) {
        if (err) return handleError(err, res, 500);
        res.send(obj);
    });
});

// ------ Update admin ------
app.put(settings.api + '/admins/:id', function(req, res) {
    db.Admin.findByIdAndUpdate(req.params.id, req.body, { 'new': true }, function(err, obj) {
        if (err) return handleError(err, res, 500);
        res.send(obj);
    });
});

// ------ Delete admin ------
app['delete'](settings.api + '/admins/:id', function(req, res) {
    db.Admin.findByIdAndRemove(req.params.id, function(err) {
        if (err) return handleError(err, res, 500);
        res.send({});
    });
});

// ------ Change admin password ------
app.post(settings.api + '/admins/:id/password/change', function(req, res) {

    db.Admin.findOne({ username: req.admin.username}).exec(function(err, admin) {
        if (err) return handleError(err, res);
        if (!admin) return handleError("Not found error", res, 404);
        if (!verifyPassword(req.body.password_old, admin.password)) return handleError('Password is incorrect', res, 400);

        db.admin.findByIdAndUpdate(req.params.id, {
            password: generatePasswordHash(req.body.password_new)
        }, { 'new': true }, function(err, obj) {
            if (err) return handleError(err, res, 500);
            res.send({success: true});
        });
    });

});

var getInternshipCountByCity = function (res, data, callback) {
    db.Internship.countDocuments({"employer.city": data[1]}).exec(function (err, count) {
        if (err) return handleError(err, res, 500);
        callback(data.concat([count]));
    });
};

var getEmployerCountByCity = function (res, data, callback) {
    db.Employer.countDocuments({"city": data[1]}).exec(function (err, count) {
        if (err) return handleError(err, res, 500);
        callback(data.concat([count]));
    });
};

var getStudentCountByCity = function (res, data, callback) {
    db.Student.countDocuments({"current_city": data[1]}).exec(function (err, count) {
        if (err) return handleError(err, res, 500);
        callback(data.concat([count]));
    });
};
