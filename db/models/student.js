const mongoose = require('mongoose');
const Schema = mongoose.Schema;

exports.student = Schema({
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
    current_email: {
        type: 'String',
        unique : true,
        required : true,
        dropDups: true
    },
    alternate_email: {
        type: 'String'
    },
    linkedin_url: {
        type: 'String'
    },
    alternate_url: {
        type: 'String'
    },
    primary_phone: {
        type: 'String'
    },
    permanent_phone: {
        type: 'String'
    },
    ethnicity: {
        type: 'String'
    },
    resume_url: {
        type: 'String'
    },
    gender: {
        type: 'Number' // 1: Male, 2: Female, 3: Other
    },
    current_address1: {
        type: 'String'
    },
    current_address2: {
        type: 'String'
    },
    current_city: {
        type: 'String'
    },
    current_state: {
        type: 'String'
    },
    current_zipcode: {
        type: 'String'
    },
    permanent_address1: {
        type: 'String'
    },
    permanent_address2: {
        type: 'String'
    },
    permanent_city: {
        type: 'String'
    },
    permanent_state: {
        type: 'String'
    },
    permanent_zipcode: {
        type: 'String'
    },
    college: {
        type: 'String'
    },
    major: {
        type: 'String'
    },
    certificate: {
        type: 'String'
    },
    transcript: {
        type: 'String'
    },
    transcript_url: {
        type: 'String'
    },
    degree_level: {
        type: 'Number' // 1: Undergraduate, 2: Graduate Student 3: Recent Graduate/Alum
    },
    grade_point_average: {
        type: 'Number'
    },
    year_in_school: {
        type: 'Number'
    },
    graduation_date: {
        type: 'Date'
    },
    interests: {
        type: 'String'
    },
});