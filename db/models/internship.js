const mongoose = require('mongoose');
const Schema = mongoose.Schema;

exports.internship = Schema({
    id: {
        type: 'number',
        unique : true,
        required : true,
        dropDups: true
    },
    hashtag: {
        type: 'String',
        required: true,
    },
    link: {
        type: 'String',
        required: true,
    },
    title: {
        type: 'String',
        required: true,
    },
    read_date: {
        type: 'Date',
        required: true,
    },
    employer: {
        _id: {
            type: Schema.ObjectId,
            ref : "Employer",
            required: true,
        },
        username: {
            type: 'String',
            required : true,
        },
        first_name: {
            type: 'String',
            required: true,
        },
        last_name: {
            type: 'String',
            required: true,
        },
        email: {
            type: 'String',
            required : true,
        },
        company_name: {
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
    },
    application: {
        type: {
            _id: {
                type: Schema.ObjectId,
                required: true,
                ref: 'Application',
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
                default: 1, // 1: Draft, 2: Pending, 3: Approved, 4: Denied
            },
            approved_denied_time: {
                type: 'Date',
            },
            denied_comment: {
                type: 'String',
            }
        },
    },
    hire_data: {
        type: {
            _id: {
                type: Schema.ObjectId,
                ref: 'HireData',
            },
            student_id: {
                type: Schema.ObjectId,
                ref: 'Student',
            },
        }
    },
    reimbursement: {
        type: {
            student: {
                _id: {
                    type: Schema.ObjectId,
                    ref : "Student",
                    required: true,
                },
                username: {
                    type: 'String',
                    required : true,
                },
                first_name: {
                    type: 'String',
                    required: true,
                },
                last_name: {
                    type: 'String',
                    required: true,
                },
                email: {
                    type: 'String',
                    required : true,
                },
            },
            payroll: {
                type: 'String',
                required: true,
            },
            payroll_url: {
                type: 'String',
                required: true,
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
            denied_comment: {
                type: 'String',
            },
            approved_denied_time: {
                type: 'Date',
            },
        }
    },
});