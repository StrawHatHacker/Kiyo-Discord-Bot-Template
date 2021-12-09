'use strict';

const GuildModel = require('../models/guild');
const sendLog = require('../utils/sendLog');

module.exports = async (_client, messages) => {
    const firstMessage = messages.first();

    // If guild is not available because of outage return
    if (!firstMessage.guild.available) return;

    if (firstMessage.channel.type !== 'GUILD_TEXT') return;

    const Guild = await GuildModel.findById(firstMessage.guild.id);
    if (!Guild) return;

    await sendLog('messageDeleteBulk', Guild, firstMessage.guild, messages);
};
