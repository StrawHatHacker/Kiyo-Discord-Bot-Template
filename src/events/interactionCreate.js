'use strict';

const checkForSlashPermissions = require('../utils/checkForSlashPermissions');
const interactionErrorHandler = require('../utils/interactionErrorHandler');
const { CommandInteraction, Client } = require('discord.js');
const databaseUtils = require('../utils/database');
const onCooldown = require('../utils/onCooldown');

/**
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */
module.exports = async (client, interaction) => {
    // If guild is not available becase of outage return
    if (!interaction.guild?.available) return;
    if (!interaction.isCommand() || !interaction.inGuild()) return;

    // Find the interaction
    const interactionToRun = client.slashCommands.find(i => i.aliases.includes(interaction.commandName) || interaction.commandName === i.name);
    if (!interactionToRun) return;

    const { name, run, requiredPermissions, cooldown } = interactionToRun;

    // If interaction has a cooldown, check if the user is on cooldown
    if (cooldown && onCooldown(name, interaction.member.id, cooldown) === true)
        return interaction.reply({ content: 'You are on cooldown', ephemeral: true });

    const Guild = await databaseUtils.guild.findOneOrCreate(interaction.guild.id);
    await databaseUtils.user.findOneOrCreate(interaction.member.id);
    await interaction.guild.fetch();

    // Checking both member and bot permissions before executing the interaction
    if (!checkForSlashPermissions(interaction, name, requiredPermissions)) return;

    // Run the interaction
    run(client, interaction, Guild)
        .catch(e => interactionErrorHandler(e, interaction));
};
