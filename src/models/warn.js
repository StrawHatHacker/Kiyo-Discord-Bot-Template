'use strict';

const { Schema, model } = require('mongoose');

// WARNS SHOULD NOT BE DELETED
// Instead change the deleted flag to true
const WarnSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    warn_type: {
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
    collection: 'warn',
    autoIndex: false
});

module.exports = model('warn', WarnSchema);
