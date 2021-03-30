'use strict';

const { Schema, model } = require('mongoose');

const GuildSchema = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true,
    },
    prefix:{
        type: String,
        default: '>'
    }
}, {
    timestamps: true,
    validateBeforeSave: true,
    minimize: false,
    id: false,
    collection: 'guild',
    autoIndex: false
});

module.exports = model('guild', GuildSchema);