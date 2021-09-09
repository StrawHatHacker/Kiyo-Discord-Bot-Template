'use strict';

const { MessageEmbed } = require('discord.js');
const Err = require('../classes/Err');

module.exports = class Embed extends MessageEmbed {
    /**
     * @param {MessageEmbed} data 
     */
    constructor(data = {}) {
        super(data);
        if (data.color && typeof data.color !== 'number') throw new Err(400).inputErr().setMessage('Color should be a number');
        if (data.timestamp && typeof data.timestamp !== 'number') throw new Err(400).inputErr().setMessage('Timestamp should be a number');
    }

    // Appends a string to the `.description` property of the object (don't confuse with the inherited `.setDescription` method which replaces the previous description value)
    addDescription(appendable) {
        /*                 `.description` property starts as null                                */
        /*                 if embed has null description initialize it as an empty string        */
        this.description = (this.description === null ? '' : this.description) + '\n' + appendable;
        return this;
    }
};
