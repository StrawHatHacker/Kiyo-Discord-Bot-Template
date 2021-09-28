'use strict';

const { Schema, model } = require('mongoose');

const MuteSchema = new Schema({
    mute_expire_at: {
        type: Date,
        index: { expires: '1m' },
        required: true
    }
}, {
    validateBeforeSave: true,
    minimize: false,
    collection: 'mute'
});

module.exports = model('mute', MuteSchema);
