const mongoose = require('mongoose');
const Schema = mongoose.Schema;

exports.hiredata = Schema({
    student_id: {
        type: Schema.ObjectId,
        required: true,
        ref: 'Student',
    },
    internship: {
        _id: {
            type: Schema.ObjectId,
            required: true,
            ref : "Internship",
        },
        company_name: {
            type: 'String',
            required: true,
        },
        title: {
            type: 'String',
            required: true,
        }
    },
    semester: {
        type: 'Number',
        required: true, // 1: Spring, 2: Summer, 3: Fall, 4: Winter
    },
    year: {
        type: 'Number',
        required: true,
    },
    start_date: {
        type: 'Date',
    },
    end_date: {
        type: 'Date',
    },
    hourly_compensation: {
        type: 'Number',
    },
    hours_per_week : {
        type: 'Number',
    },
    supervisor_first_name: {
        type: 'String',
        required: true,
    },
    supervisor_last_name: {
        type: 'String',
        required: true,
    },
    supervisor_title: {
        type: 'String',
        required: true,
    },
    supervisor_phone_number: {
        type: 'String',
    },
    supervisor_email: {
        type: 'String',
        required: true,
    },
    internship_address1: {
        type: 'String',
    },
    internship_address2: {
        type: 'String',
    },
    internship_city: {
        type: 'String',
    },
    internship_state: {
        type: 'String',
    },
    internship_zipcode: {
        type: 'String',
    },
    placement_found_way: {
        type: 'String'
    },
    education: {
        type: 'Number', // 1, 2, 3, 4, 5
    },
    status: {
        type: 'Number',
        default: 2, // 1: Draft, 2: Submitted
    }
});