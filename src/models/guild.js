const { Schema, model } = require('mongoose');

const GuildSchema = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true,
    }
}, {
    timestamps: true,
    validateBeforeSave: true,
    minimize: false,
    id: false,
    collection: 'guild',
    autoIndex: false,
    _id: false
});

module.exports = model('guild', GuildSchema);