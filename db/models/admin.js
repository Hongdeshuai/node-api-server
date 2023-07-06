const mongoose = require('mongoose');
const Schema = mongoose.Schema;

exports.admin = Schema({
    username: {
        type: 'String',
        required: true
    },
    password: {
        type: 'String',
        required: true
    },
});