'use strict';

const GuildModel = require('../models/guild');
const sendLog = require('../utils/sendLog');

module.exports = async (_client, messages) => {
    const firstMessage = messages.first();

    // If guild is not available because of outage return
    if (!firstMessage.guild.available) return;

    if (
        firstMessage.channel.type !== 'GUILD_TEXT'
        && firstMessage.channel.type !== 'GUILD_NEWS'
    ) return;

    const Guild = await GuildModel.findById(firstMessage.guild.id);
    if (!Guild) return;

    if (!Guild.chatlog_ignore_channels.includes(firstMessage.channel.id)) {
        await sendLog('messageDeleteBulk', Guild, firstMessage.guild, messages);
    }
};
