'use strict';

const GuildModel = require('../models/guild');
const sendLog = require('../utils/sendLog');

module.exports = async (_client, thread) => {
    // If guild is not available because of outage return
    if (!thread.guild.available) return;

    const Guild = await GuildModel.findById(thread.guild.id);
    if (!Guild) return;

    await sendLog('threadDelete', Guild, thread.guild, thread);
};
