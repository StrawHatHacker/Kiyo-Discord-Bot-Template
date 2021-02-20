const { MessageEmbed } = require('discord.js');

module.exports = class Embed extends MessageEmbed {
    constructor() {
        super();
    };

    addDescription(string) {
        this.description = (this.description ? this.description : '') + '\n' + string;
        return this;
    };
};