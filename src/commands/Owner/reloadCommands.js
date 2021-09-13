'use strict';

module.exports = {
    name: 'ReloadCommands',
    description: 'Reload all bot commands',
    aliases: ['reloadcommands', 'rc'],
    syntax: 'reloadcommands',
    requiredPermissions: {
        user: [],
        client: []
    },
    async run({ message, client }) {
        if (message.author.id !== process.env.BOT_OWNER_ID) return;

        await client.reloadCommands();
        await message.member.send('Commands reloaded');
    }
};
