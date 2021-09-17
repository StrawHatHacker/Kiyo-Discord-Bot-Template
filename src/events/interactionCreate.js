'use strict';

const interactionErrorHandler = require('../utils/interactionErrorHandler');
const checkForSlashPermissions = require('../utils/checkForSlashPermissions');

module.exports = async (client, interaction) => {
    if (!interaction.isCommand() || !interaction.inGuild()) return;

    for (const { name, run, requiredPermissions } of client.slashCommands) {
        if (interaction.commandName !== name) continue;

        // Checking both member and bot permissions before executing the command
        if (!checkForSlashPermissions(interaction, name, requiredPermissions)) return;

        return run(client, interaction).catch(e => interactionErrorHandler(e, interaction));

    }
};
