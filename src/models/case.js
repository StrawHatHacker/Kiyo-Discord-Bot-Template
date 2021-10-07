'use strict';

const { Schema, model } = require('mongoose');

// CASES SHOULD NOT BE DELETED
// Instead change the deleted flag to true
const CaseSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    case_type: {
        type: String,
        required: true
    },
    guild_id: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    moderator: {
        type: String,
        required: true
    },
    case: {
        type: Number,
        required: true
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    validateBeforeSave: true,
    minimize: false,
    collection: 'case',
    autoIndex: false
});

module.exports = model('case', CaseSchema);
