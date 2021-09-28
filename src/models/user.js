'use strict';

const { Schema, model } = require('mongoose');

const MuteSchema = new Schema({
    doc_id: {
        type: String,
        required: true
    },
    guild_id: {
        type: String,
        required: true
    },
    roles_muted_with: {
        type: [String],
        required: true
    }
});

const UserSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    mutes: {
        type: [MuteSchema],
        default: []
    }
}, {
    timestamps: true,
    validateBeforeSave: true,
    minimize: false,
    collection: 'user',
    autoIndex: false
});

module.exports = model('user', UserSchema);
