const multer  = require('multer');
const settings = require('./base.js');

const student_allowed_types = [
    'application/pdf',
    'application/rtf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const application_allowed_types = [
    'application/pdf',
    'application/rtf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const reimbursement_allowed_types = [
    'application/pdf',
    'application/rtf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

//MULTER CONFIG: to get file documents to temp server storage
exports.studentMulterConfig = {
    storage: multer.diskStorage({
        //Setup where the user's file will go
        destination: function(req, file, next) {
            next(null, settings.studentPublicPath);
        },

        //Then give the file a unique name
        filename: function(req, file, next) {
            const arr = file.originalname.split('.');
            const ext = arr[arr.length - 1];
            next(null, file.fieldname + '_' + Date.now() + '.' + ext);
        }
    }),

    //A means of ensuring only documents are uploaded.
    fileFilter: function(req, file, next) {
        if (!file) {
            next();
        }

        if (student_allowed_types.indexOf(file.mimetype) !== -1){
            console.log('file uploaded');
            next(null, true);
        } else {
            console.log("file not supported");

            //TODO:  A better message response to user on failure.
            next(new Error('Unknown media type'));
        }
    }
};

exports.applicationMulterConfig = {
    storage: multer.diskStorage({
        //Setup where the user's file will go
        destination: function(req, file, next) {
            next(null, settings.applicationPublicPath);
        },

        //Then give the file a unique name
        filename: function(req, file, next) {
            const arr = file.originalname.split('.');
            const ext = arr[arr.length - 1];
            next(null, file.fieldname + '_' + Date.now() + '.' + ext);
        }
    }),

    //A means of ensuring only documents are uploaded.
    fileFilter: function(req, file, next) {
        if (!file) {
            next();
        }

        if (application_allowed_types.indexOf(file.mimetype) !== -1){
            console.log('file uploaded');
            next(null, true);
        } else {
            console.log("file not supported");

            //TODO:  A better message response to user on failure.
            next(new Error('Unknown media type'));
        }
    }
};

exports.reimbursementMulterConfig = {
    storage: multer.diskStorage({
        //Setup where the user's file will go
        destination: function(req, file, next) {
            next(null, settings.reimbursementPublicPath);
        },

        //Then give the file a unique name
        filename: function(req, file, next) {
            const arr = file.originalname.split('.');
            const ext = arr[arr.length - 1];
            next(null, file.fieldname + '_' + Date.now() + '.' + ext);
        }
    }),

    //A means of ensuring only documents are uploaded.
    fileFilter: function(req, file, next) {
        if (!file) {
            next();
        }

        if (reimbursement_allowed_types.indexOf(file.mimetype) !== -1){
            console.log('file uploaded');
            next(null, true);
        } else {
            console.log("file not supported");

            //TODO:  A better message response to user on failure.
            next(new Error('Unknown media type'));
        }
    }
};
