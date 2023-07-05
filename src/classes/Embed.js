'use strict';

const { EmbedBuilder } = require('discord.js');
const Err = require('../classes/Err');

module.exports = class Embed extends EmbedBuilder {
    /**
     * @param {EmbedBuilder} data 
     */
    constructor(data = {}) {
        super(data);
        if (data.color && typeof data.color !== 'number') throw new Err(400).inputErr().setMessage('Color should be a number');
        if (data.timestamp && typeof data.timestamp !== 'number') throw new Err(400).inputErr().setMessage('Timestamp should be a number');
        if (!this.data.fields) this.data.fields = [];
    }

    // TODO check here if embed description length is above the character limit
    /**
    * @description Appends a string to the `.description` property of the object **IN A NEW LINE** (don't confuse with the inherited `.setDescription` method which replaces the previous description value)
    * @param {string} appendable
    */
    addDescription(appendable) {
        this.data.description = (!this.data.description ? '' : this.data.description) + '\n' + appendable;
        return this;
    }

    // TODO check here if embed description length is above the character limit
    /**
    * @description Appends a string to the `.description` property of the object **IN THE SAME LINE** (don't confuse with the inherited `.setDescription` method which replaces the previous description value)
    * @param {string} appendable
    */
    appendDescription(appendable) {
        console.log(appendable);
        this.data.description = (!this.data.description  ? '' : this.data.description) + appendable.trim();
        return this;
    }

    isSuccess() {
        this.data.description = '✅ ' + this.data.description;
        this.data.color = 0x2ECC71;
        return this;
    }

    isFailure() {
        this.data.description = '❎ ' + this.data.description;
        this.data.color = 0xaf4541;
        return this;
    }

    /**
    * @param {string} name
    * @param {string} value
    * @param {boolean} inline
    */
    addField(name, value, inline = false) {
        this.data.fields.push({ name, value, inline });
        return this;
    }
};
