const mongoose = require('mongoose');
const Schema = mongoose.Schema;

exports.reimbursement = Schema({
    internship: {
        _id: {
            type: Schema.ObjectId,
            required: true,
            ref: 'Internship'
        },
        title: {
            type: 'String',
            required: true,
        }
    },
    employer: {
        _id: {
            type: Schema.ObjectId,
            ref : "Employer",
            required: true,
        },
        company_name: {
            type: 'String',
            required: true,
        },
    },
    student_id: {
        type: Schema.ObjectId,
        ref : "Student",
        required: true,
    },
    payroll: {
        type: 'String',
    },
    payroll_url: {
        type: 'String',
    },
    completed_hours: {
        type: 'Number',
        required: true,
    },
    hourly_rate: {
        type: 'Number',
        required: true,
    },
    amount: {
        type: 'Number',
        required: true,
    },
    checkout: {
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