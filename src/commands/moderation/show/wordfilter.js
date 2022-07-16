'use strict';

const Embed = require('../../../classes/Embed');

module.exports = {
    name: 'showwordfilter',
    description: 'View the current filtered words',
    aliases: [],
    syntax: 'showwordfilter',
    requiredPermissions: {
        user: ['ADMINISTRATOR'],
        client: []
    },
    async run({ message, Guild }) {

        const e = new Embed();

        e.addDescription(Guild.filtered_words.length > 0 ? `||${Guild.filtered_words.join(', ')}||` : '`No words added`');

        await message.channel.send({ embeds: [e] });
    }
};
