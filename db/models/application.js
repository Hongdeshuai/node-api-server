const mongoose = require('mongoose');
const Schema = mongoose.Schema;

exports.application = Schema({
    internship: {
        _id: {
            type: Schema.ObjectId,
            required: true,
            ref: 'Internship',
        },
        title: {
            type: 'String',
            required: true,
        },
    },
    employer: {
        _id: {
            type: Schema.ObjectId,
            required: true,
            ref: 'Employer',
        },
        company_name: {
            type: 'String',
            required: true,
        },
    },
    supervisor_first_name: {
        type: 'String',
    },
    supervisor_last_name: {
        type: 'String',
    },
    supervisor_title: {
        type: 'String',
    },
    supervisor_phone_number: {
        type: 'String',
    },
    supervisor_email: {
        type: 'String',
    },
    semester: {
        type: 'Number', // 1: Spring, 2: Summer, 3: Fall, 4: Winter
    },
    year: {
        type: 'Number'
    },
    amount: {
        type: 'Number',
    },
    total_hours: {
        type: 'Number',
    },
    hourly_rate: {
        type: 'Number',
    },
    organization_benefit: {
        type: 'String',
    },
    hire_benefit: {
        type: 'String',
    },
    is_hire: {
        type: 'Boolean',
        default: false,
    },
    is_new_internship: {
        type: 'Boolean',
        default: true,
    },
    ability: {
        type: 'Number', // 1, 2, 3
    },
    other_ability: {
        type: 'String',
    },
    is_stem: {
        type: 'Boolean',
        default: true,
    },
    is_resubmit: {
        type: 'Boolean',
        default: false,
    },
    comment: {
        type: 'String'
    },
    w9form_url: {
        type: 'String',
    },
    is_confirm: {
        type: 'Boolean',
        default: false,
    },
    status: {
        type: 'Number',
        default: 2, // 1: Draft, 2: Pending, 3: Approved, 4: Denied
    },
    approved_denied_time: {
        type: 'Date',
    },
    denied_comment: {
        type: 'String',
    }
});