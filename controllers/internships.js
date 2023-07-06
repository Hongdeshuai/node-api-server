const app = require('../app.js');
const db = require('../db/db_schema.js');
const settings = require('../config/base.js');
const handleError = require('../exceptions/handler.js').handleError;


// ------ Endpoints ------


// ------ Get all internships from student------
app.get(settings.api + '/students/internships', function(req, res) {
    var filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    db.Internship.find(filter).select('-hire_data -reimbursement').exec(function(err, list) {
        if (err) return handleError(err, res, 500);
        res.send(list);
    });
});

// ------ Get internship from id from student------
app.get(settings.api + '/students/internships/:id', function(req, res) {
    db.Internship.findOne({ _id: req.params.id }).select('-hire_data -reimbursement').exec(function(err, obj) {
        if (err) return handleError(err, res, 404);
        res.send(obj);
    });
});

// ------ Get all internships from employer------
app.get(settings.api + '/employers/internships', function(req, res) {
    var filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    filter['employer._id'] = req.employer._id;
    db.Internship.find(filter).exec(function(err, list) {
        if (err) return handleError(err, res, 500);
        res.send(list);
    });
});

// ------ Get internship from id from employer------
app.get(settings.api + '/employers/internships/:id', function(req, res) {
    db.Internship.findOne({ _id: req.params.id }).exec(function(err, obj) {
        if (err) return handleError(err, res, 404);
        res.send(obj);
    });
});

// ------ Get all internships from admin------
app.get(settings.api + '/admins/internships', function(req, res) {
    var filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    db.Internship.find(filter).exec(function(err, list) {
        if (err) return handleError(err, res, 500);
        res.send(list);
    });
});

// ------ Get internships by location from admin------
app.get(settings.api + '/admins/internships/locations', function(req, res) {
    resp = [];
    db.Employer.distinct("city").exec(function(err, cities) {
        if (err) return handleError(err, res, 500);
        if (cities.length === 0) res.send({"counts": []});

        for (var i = 0; i < cities.length; i++) {
            getInternshipCount(res, {"employer.city": cities[i]}, function(data) {
                resp.push({"location": data['filter']['employer.city'], "count": data.count});
                if (resp.length === cities.length) res.send({"counts": resp});
            })
        }
    })
});

// ------ Get internship from id from admin------
app.get(settings.api + '/admins/internships/:id', function(req, res) {
    db.Internship.findOne({ _id: req.params.id }).exec(function(err, obj) {
        if (err) return handleError(err, res, 404);
        res.send(obj);
    });
});

// ------ Create and update internships ------
app.post(settings.api + '/internships', function(req, res) {
    var is_finish_create = false;
    var is_success_create = false;
    var is_finish_update = false;
    var is_success_update = false;
    var failed_ids = [];

    prepareInternships(req.body.internships, res, function(new_internships, exist_internships) {
        is_finish_create = is_success_create = new_internships.length === 0;
        is_finish_update = is_success_update = exist_internships.length === 0;

        if (new_internships.length > 0) {
            createInternships(new_internships, function(ids) {
                is_success_create = ids.length === 0;
                is_finish_create = true;
                failed_ids = failed_ids.concat(ids);

                checkFinishInternshipPost(is_finish_create, is_finish_update, function(is_finish) {
                    if (is_finish) res.send({create: is_success_create, update: is_success_update, failed_ids: failed_ids});
                });
            });
        }

        if (exist_internships.length > 0) {
            updateInternships(exist_internships, function(ids) {
                is_success_update = ids.length === 0;
                is_finish_update = true;
                failed_ids = failed_ids.concat(ids);

                checkFinishInternshipPost(is_finish_create, is_finish_update, function(is_finish) {
                    if (is_finish) res.send({create: is_success_create, update: is_success_update, failed_ids: failed_ids});
                });
            });
        }
    });
});

// ------ Delete internship ------
app.delete(settings.api + '/employers/internships/:id', function(req, res) {
    db.Internship.findOneAndRemove({_id: req.params.id, 'employer._id': req.employer._id}, function(err) {
        if (err) return handleError(err, res, 500);
        res.send({});
    });
});


var prepareInternships = function(internships, res, callback) {
    var new_internships = [];
    var exist_internships = [];

    internships.forEach(function(internship) {
        prepareInternship(internship, res, function(resp) {
           if (resp.is_new) {
               new_internships.push(resp.internship);
           } else {
               exist_internships.push(resp.internship);
           }

           if (new_internships.length + exist_internships.length === internships.length) {
               callback(new_internships, exist_internships);
           }
        });
    });
};

var prepareInternship = function(internship, res, callback) {
    db.Employer.findOne({ company_name: internship.company_id }).select('-password').exec(function(err, employer) {
        if (err) return handleError(err, res, 404);
        obj = internship;
        obj.employer = employer;
        callback({is_new: internship.is_new, internship: obj})
    });
};

var createInternships = function(internships, callback) {
    var failed_ids = [];
    var succeed_ids = [];

    internships.forEach(function(internship) {
        createInternship(internship, function(resp) {
            if (resp.is_success) {
                succeed_ids.push(resp.internship.id);
            } else {
                failed_ids.push(resp.internship.id);
            }

            if (failed_ids.length + succeed_ids.length === internships.length) {
                callback(failed_ids);
            }
        });
    });
};

var createInternship = function(internship, callback) {
    obj = new db.Internship(internship);
    obj.save(function(err) {
        console.log(err);
        callback({is_success: !err, internship: internship});
    });
};

var updateInternships = function(internships, callback) {
    var failed_ids = [];
    var succeed_ids = [];

    internships.forEach(function(internship) {
        updateInternship(internship, function(resp) {
            if (resp.is_success) {
                succeed_ids.push(resp.internship.id);
            } else {
                failed_ids.push(resp.internship.id);
            }

            if (failed_ids.length + succeed_ids.length === internships.length) {
                callback(failed_ids);
            }
        });
    });
};

var updateInternship = function(internship, callback) {
    db.Internship.findOneAndUpdate({id: internship.id}, internship, { 'new': true }, function(err, obj) {
        callback({is_success: !err && !!obj, internship: internship});
    });
};

var checkFinishInternshipPost = function(is_finish_create, is_finish_update, callback) {
    callback(is_finish_create && is_finish_update);
};


var getInternshipCount = function(res, filter, callback) {
    db.Internship.countDocuments(filter).exec(function(err, count) {
        if (err) return handleError(err, res, 500);
        callback({"filter": filter, "count": count});
    });
};
