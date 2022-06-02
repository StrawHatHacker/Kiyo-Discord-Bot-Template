'use strict';

const { Schema, model } = require('mongoose');

const FieldSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    value: {
        type: String,
        default: ''
    },
    inline: {
        type: Boolean,
        default: false
    }
}, {
    _id: false,
});

const AuthorSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    iconURL: {
        type: String,
        default: ''
    },
    url: {
        type: String,
        default: ''
    }
}, {
    _id: false,
});

const FooterSchema = new Schema({
    text: {
        type: String,
        default: ''
    },
    iconURL: {
        type: String,
        default: ''
    }
}, {
    _id: false
});

const EmbedSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    url: {
        type: String,
        default: ''
    },
    color: {
        type: Number,
        default: null
    },
    timestamp: {
        type: Number,
        default: null
    },
    fields: {
        type: [FieldSchema],
        default: []
    },
    thumbnail: {
        url: {
            type: String,
            default: ''
        }
    },
    image: {
        url: {
            type: String,
            default: ''
        }
    },
    author: {
        type: AuthorSchema
    },
    footer: {
        type: FooterSchema
    }
}, {
    timestamps: true,
    validateBeforeSave: true,
    minimize: false,
    collection: 'embed',
    autoIndex: false
});

module.exports = model('embed', EmbedSchema);
