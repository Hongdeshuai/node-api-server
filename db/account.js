const generatePasswordHash = require('../utils/helper.js').generatePasswordHash;

/**
 * Get admin by username
 * @param {*} username
 * @param {*} callback
 */
exports.getAdmin = function(username, callback) {
    db.Admin.findOne({ username: username}).lean().exec(function(err, admin) {
        callback(admin);
    });
};

/**
 * Get admin by _id
 * @param {*} _id
 * @param {*} callback
 */
exports.getAdminById = function(_id, callback) {
    db.Admin.findById(_id).lean().exec(function(err, admin) {
        callback(admin);
    });
};

/**
 * Get student by username
 * @param {*} username
 * @param {*} callback
 */
exports.getStudent = function(username, callback) {
    db.Student.findOne({ username: username }).lean().exec(function(err, student) {
        callback(student);
    });
};

/**
 * Get student by _id
 * @param {*} _id
 * @param {*} callback
 */
exports.getStudentById = function(_id, callback) {
    db.Student.findById(_id).lean().exec(function(err, student) {
        callback(student);
    });
};

/**
 * Get employer by username
 * @param {*} username
 * @param {*} callback
 */
exports.getEmployer = function(username, callback) {
    db.Employer.findOne({ username: username }).lean().exec(function(err, employer) {
        callback(employer);
    });
};

/**
 * Get employer by _id
 * @param {*} _id
 * @param {*} callback
 */
exports.getEmployerById = function(_id, callback) {
    db.Employer.findById(_id).lean().exec(function(err, employer) {
        callback(employer);
    });
};

/**
 * Create admin if is the first start
 */
exports.createAdmin = function() {
    db = require('../db/db_schema.js');
    db.Admin.countDocuments().exec(function(err, count) {
        if (count === 0) {
            var admin = new db.Admin({
                username: 'admin',
                password: generatePasswordHash('123456'),
            });
            admin.save(function(err) {
                if (err) throw err;
            });
        };
    });
};
