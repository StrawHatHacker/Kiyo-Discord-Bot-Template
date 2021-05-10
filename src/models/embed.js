'use strict';

const { Schema, model } = require('mongoose');

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
    title: String,
    description: String,
    url: String,
    color: Number,
    timestamp: Number,
    fields: [{
        name: String,
        value: String,
        inline: Boolean
    }],
    thumbnail: {
        url: String
    },
    image: {
        url: String
    },
    author: {
        name: String,
        iconURL: String,
        url: String
    },
    footer: {
        text: String,
        iconURL: String
    }
}, {
    timestamps: true,
    validateBeforeSave: true,
    minimize: false,
    id: false,
    collection: 'embed',
    autoIndex: false
});

module.exports = model('embed', EmbedSchema);
