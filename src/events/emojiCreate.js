'use strict';

const GuildModel = require('../models/guild');
const sendLog = require('../utils/sendLog');

module.exports = async (_client, emoji) => {
    // If guild is not available because of outage return
    if (!emoji.guild.available) return;

    const Guild = await GuildModel.findById(emoji.guild.id);
    if (!Guild) return;

    await sendLog('emojiCreate', Guild, emoji.guild, emoji);
};
