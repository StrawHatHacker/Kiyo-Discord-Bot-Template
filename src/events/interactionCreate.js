'use strict';

const checkForSlashPermissions = require('../utils/checkForSlashPermissions');
const interactionErrorHandler = require('../utils/interactionErrorHandler');
const databaseUtils = require('../utils/database');
const onCooldown = require('../utils/onCooldown');

module.exports = async (client, interaction) => {
    // If guild is not available becase of outage return
    if (!interaction.guild?.available) return;
    if (!interaction.isCommand() || !interaction.inGuild()) return;

    for (const { name, run, aliases, requiredPermissions, cooldown } of client.slashCommands) {

        if (!aliases.includes(interaction.commandName) && interaction.commandName !== name) continue;
        if (cooldown && onCooldown(name, interaction.member.id, cooldown) === true)
            return interaction.reply({ content: 'You are on cooldown', ephemeral: true });

        await databaseUtils.user.findOneOrCreate(interaction.member.id);

        // Checking both member and bot permissions before executing the command
        if (!checkForSlashPermissions(interaction, name, requiredPermissions)) return;

        return run(client, interaction).catch(e => interactionErrorHandler(e, interaction));

    }
};
