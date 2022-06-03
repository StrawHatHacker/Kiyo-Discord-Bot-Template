'use strict';

const Embed = require('../../../classes/Embed');

const spacing = '\u2005\u2005\u2005\u2005\u2005\u2005';

module.exports = {
    name: 'showconfig',
    description: 'View the current configuration of the the server',
    aliases: [],
    syntax: 'showconfig',
    requiredPermissions: {
        user: ['ADMINISTRATOR'],
        client: []
    },
    async run({ message, Guild }) {

        const e = new Embed()
            .setAuthor({ name: `Server Config for ${message.guild.name}`, iconURL: message.guild.iconURL({ size: 512 }) });

        e.addDescription(`${Guild.features.moderationlog ? '✅' : '❎'} Moderation Log`);
        e.addDescription(`${spacing}${Guild.moderation_log_channel_id ? `<#${Guild.moderation_log_channel_id}>` : '`No channel set`'}`);

        e.addDescription(`${Guild.features.messagelog ? '✅' : '❎'} Message Log`);
        e.addDescription(`${spacing}${Guild.message_log_channel_id ? `<#${Guild.message_log_channel_id}>` : '`No channel set`'}`);

        e.addDescription(`${Guild.features.serverlog ? '✅' : '❎'} Server Log`);
        e.addDescription(`${spacing}${Guild.server_log_channel_id ? `<#${Guild.server_log_channel_id}>` : '`No channel set`'}`);

        e.addDescription(`${Guild.features.memberlog ? '✅' : '❎'} Member Log`);
        e.addDescription(`${spacing}${Guild.member_log_channel_id ? `<#${Guild.server_log_channel_id}>` : '`No channel set`'}`);

        e.addDescription(`${Guild.features.welcomemessages ? '✅' : '❎'} Welcome Messages`);
        e.addDescription(`${spacing}${Guild.welcome_channel_id ? `<#${Guild.welcome_channel_id}>` : '`No channel set`'}`);

        e.addDescription(`${Guild.features.leavemessages ? '✅' : '❎'} Leave Messages`);
        e.addDescription(`${spacing}${Guild.leave_channel_id ? `<#${Guild.leave_channel_id}>` : '`No channel set`'}`);

        e.addDescription(`${Guild.features.filter ? '✅' : '❎'} Word Filter`);
        e.addDescription(`${spacing}${Guild.filtered_words.length > 0 ? `${Guild.filtered_words.length} word(s)` : '`No words added`'}`);

        e.addDescription(`${Guild.features.invitelinks ? '✅' : '❎'} Invite Link Deletion`);

        e.addDescription(`\n${'✅'} - enabled | ${'❎'} - disabled`);

        await message.channel.send({ embeds: [e] });
    }
};
