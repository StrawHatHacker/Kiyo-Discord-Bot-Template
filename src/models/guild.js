'use strict';

const { Schema, model } = require('mongoose');

const FeaturesSchema = new Schema({
    welcomemessages: {
        type: Boolean,
        default: true
    },
    leavemessages: {
        type: Boolean,
        default: true
    },
    moderationlog: {
        type: Boolean,
        default: true
    },
    messagelog: {
        type: Boolean,
        default: true
    },
    serverlog: {
        type: Boolean,
        default: true
    },
    memberlog: {
        type: Boolean,
        default: true
    },
    filter: {
        type: Boolean,
        default: true
    }
}, {
    _id: false
});

const GuildSchema = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true,
    },
    prefix: {
        type: String,
        default: '>'
    },
    features: {
        type: FeaturesSchema,
        default: () => ({})
    },
    welcome_channel_id: {
        type: String,
        default: null
    },
    welcome_embed_id: {
        type: String,
        default: null
    },
    leave_channel_id: {
        type: String,
        default: null
    },
    leave_embed_id: {
        type: String,
        default: null
    },
    mute_roles: {
        type: [String],
        default: []
    },
    moderation_log_channel_id: {
        type: String,
        default: ''
    },
    message_log_channel_id: {
        type: String,
        default: ''
    },
    server_log_channel_id: {
        type: String,
        default: ''
    },
    member_log_channel_id: {
        type: String,
        default: ''
    },
    filtered_words: {
        type: [String],
        default: []
    },
    security_policy: {
        type: String,
        default: 'off'
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
