'use strict';

const GuildModel = require('../models/guild');
const sendLog = require('../utils/sendLog');

module.exports = async (_client, sticker) => {
    // If guild is not available because of outage return
    if (!sticker.guild.available) return;

    const Guild = await GuildModel.findById(sticker.guild.id);
    if (!Guild) return;

    await sendLog('stickerDelete', Guild, sticker.guild, sticker);
};
