'use strict';

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'reloadcommands',
    description: 'Reload all bot commands',
    syntax: 'reloadcommands',
    requiredPermissions: {
        user: [],
        client: []
    },
    slashCommand: true,
    data: new SlashCommandBuilder().setName('reloadcommands').setDescription('Reload all bot commands'),
    async run(client, interaction) {
        if (interaction.user.id !== process.env.BOT_OWNER_ID) return;

        await client.reloadCommands();
        await interaction.reply({ content: '✅ Commands reloaded', ephemeral: true });
    }
};
