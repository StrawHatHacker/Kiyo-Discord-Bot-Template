'use strict';

const GuildModel = require('../models/guild');
const sendLog = require('../utils/sendLog');

module.exports = async (_client, oldSticker, newSticker) => {
    // If guild is not available because of outage return
    if (!newSticker.guild.available) return;

    const Guild = await GuildModel.findById(newSticker.guild.id);
    if (!Guild) return;

    await sendLog('stickerUpdate', Guild, newSticker.guild, [oldSticker, newSticker]);
};
