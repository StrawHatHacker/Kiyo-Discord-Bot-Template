'use strict';

const GuildModel = require('../models/guild');
const sendLog = require('../utils/sendLog');

module.exports = async (_client, oldEmoji, newEmoji) => {
    // If guild is not available because of outage return
    if (!newEmoji.guild.available) return;

    const Guild = await GuildModel.findById(newEmoji.guild.id);
    if (!Guild) return;

    await sendLog('emojiUpdate', Guild, newEmoji.guild, [oldEmoji, newEmoji]);
};
