'use strict';

const { MessageEmbed } = require('discord.js');

/*
    Extending MessageEmbed with our own methods
*/
module.exports = class Embed extends MessageEmbed {
    constructor(data = {}) {
        super(data);
    }

    // Appends a string to the `.description` property of the object (don't confuse with the inherited `.setDescription` method which replaces the previous description value)
    addDescription(appendable) {
        /*                 `.description` property starts as null                                */
        /*                 if embed has null description initialize it as an empty string        */
        this.description = (this.description === null ? '' : this.description) + '\n' + appendable;
        return this;
    }
};