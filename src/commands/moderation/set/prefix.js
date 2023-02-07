'use strict';

const Err = require('../../../classes/Err');

module.exports = {
    name: 'prefix',
    description: 'Change the bot\'s prefix',
    aliases: [],
    syntax: 'prefix <new prefix>',
    requiredPermissions: {
        user: ['ADMINISTRATOR'],
        client: []
    },
    async run({ message, args, Guild }) {
        let prefixInput = args[0];
        if (!prefixInput) return;

        if (prefixInput.length > 3) throw new Err(400).inputErr().setMessage('The prefix must be 3 characters or less.');

        await Guild.updateOne({ prefix: prefixInput });
        Guild.prefix = prefixInput;

        await message.channel.send(`Prefix changed to \`${prefixInput}\``);
    }
};
