'use strict';

const { SlashCommandBuilder } = require('@discordjs/builders');
const DateFormatter = require('../../utils/DateFormatter');
const prettifyRoles = require('../../utils/prettifyRoles');
const Permissions = require('../../classes/Permissions');
const { GuildMember } = require('discord.js');
const Embed = require('../../classes/Embed');
const Err = require('../../classes/Err');

module.exports = {
    name: 'userinfo',
    description: 'Shows information about a user',
    syntax: 'userinfo [user]',
    aliases: [],
    requiredPermissions: {
        user: [],
        client: []
    },
    slashCommand: true,
    cooldown: 5000,
    selfPopulate() {
        this.data = new SlashCommandBuilder().setName('userinfo').setDescription('Shows information about a user')
            .addMentionableOption(o => o.setName('user').setDescription('Mention a user (@)'));
    },
    async run(_client, interaction) {
        const mention = interaction.options.getMentionable('user');
        let targetMember;

        if (!mention) targetMember = interaction.member;
        else {
            if (!(mention instanceof GuildMember)) throw new Err(404).inputErr().memberNotFound();
            targetMember = mention;
        }

        const rolesString = prettifyRoles(targetMember.roles.cache);

        const smallAV = targetMember.user.displayAvatarURL({ size: 256, dynamic: true });
        const bigAV = targetMember.user.displayAvatarURL({ size: 4096, dynamic: true });
        const joinedAt = new DateFormatter(new Date(targetMember.joinedTimestamp)).formatToReadable();
        const createdAt = new DateFormatter(new Date(targetMember.user.createdTimestamp)).formatToReadable();

        // If member is the guild owner, bypass permission filtering and formatting
        const owner = await interaction.guild.fetchOwner();
        const memberPerms = targetMember.permissions.toArray();
        const keyPerms = targetMember.id === owner.id ? 'Owner' : new Permissions(memberPerms).filterKeyPerms().formatToReadable();
        const otherPerms = targetMember.id === owner.id ? 'Owner' : new Permissions(memberPerms).filterNonKeyPerms().formatToReadable();

        const e = new Embed()
            .setAuthor({ name: targetMember.displayName, iconURL: smallAV })
            .setThumbnail(bigAV)
            .addDescription(`Mention: ${targetMember.toString()}`);

        if (interaction.guild.features.includes('MEMBER_VERIFICATION_GATE_ENABLED'))
            e.addDescription(`Passed Screening: ${targetMember.pending}`);

        e.addDescription(`Joined at: ${joinedAt}`).addDescription(`Created at: ${createdAt}`);

        if (rolesString) {
            e.addField(`Roles (${targetMember.roles.cache.size - 1})`, `Highest: ${targetMember.roles.highest.toString()} \n\n ${rolesString}`);
        }

        e.addField('Key Permissions', keyPerms).addField('Other Permissions', otherPerms);

        await interaction.reply({ embeds: [e] });
    }
};
