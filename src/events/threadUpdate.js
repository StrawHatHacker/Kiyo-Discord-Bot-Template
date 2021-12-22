'use strict';

const GuildModel = require('../models/guild');
const sendLog = require('../utils/sendLog');

module.exports = async (_client, oldThread, newThread) => {
    // If guild is not available because of outage return
    if (!newThread.guild.available) return;

    const Guild = await GuildModel.findById(newThread.guild.id);
    if (!Guild) return;

    await sendLog('threadUpdate', Guild, newThread.guild, [oldThread, newThread]);
};
