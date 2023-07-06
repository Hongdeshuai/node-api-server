const mongoose = require('mongoose');
const Schema = mongoose.Schema;

exports.employer = Schema({
    username: {
        type: 'String',
        unique : true,
        required : true,
        dropDups: true
    },
    password: {
        type: 'String',
        required: true
    },
    first_name: {
        type: 'String',
        required: true
    },
    last_name: {
        type: 'String',
        required: true
    },
    suffix: {
        type: 'String'
    },
    title: {
        type: 'String',
        required: true,
    },
    email: {
        type: 'String',
        unique : true,
        required : true,
        dropDups: true
    },
    primary_phone: {
        type: 'String',
        required: true,
    },
    cell_phone: {
        type: 'String',
    },
    company_name: {
        type: 'String',
        required: true,
    },
    website: {
        type: 'String',
        required: true,
    },
    board_link: {
        type: 'String',
        required: true,
    },
    address1: {
        type: 'String',
    },
    address2: {
        type: 'String',
    },
    city: {
        type: 'String',
    },
    state: {
        type: 'String',
    },
    zipcode: {
        type: 'String',
    },
    region: {
        type: 'String',
    },
    organization_type: {
        type: 'Number', // 1, 2, 3, 4, 5, 6
    },
    description: {
        type: 'String',
    },
    employees_number: {
        type: 'Number', // 1: Less than 50, 2: 50-99, 3: 100-149, 4: 150 or more
    },
});