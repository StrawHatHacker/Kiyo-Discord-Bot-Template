'use strict';

const checkForSlashPermissions = require('../utils/checkForSlashPermissions');
const interactionErrorHandler = require('../utils/interactionErrorHandler');
const databaseUtils = require('../utils/database');

module.exports = async (client, interaction) => {
    // If guild is not available becase of outage return
    if (!interaction.guild?.available) return;
    if (!interaction.isCommand() || !interaction.inGuild()) return;

    for (const { name, run, aliases, requiredPermissions } of client.slashCommands) {

        if (!aliases.includes(interaction.commandName) && interaction.commandName !== name) continue;

        const User = await databaseUtils.user.findOneOrCreate(interaction.member.id);

        // Checking both member and bot permissions before executing the command
        if (!checkForSlashPermissions(interaction, name, requiredPermissions)) return;

        return run(client, interaction).catch(e => interactionErrorHandler(e, interaction));

    }
};
