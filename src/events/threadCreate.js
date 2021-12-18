'use strict';

const GuildModel = require('../models/guild');
const sendLog = require('../utils/sendLog');

module.exports = async (_client, thread) => {
    if (thread.partial) thread = await thread.fetch();

    // If guild is not available because of outage return
    if (!thread.guild.available) return;

    const Guild = await GuildModel.findById(thread.guild.id);
    if (!Guild) return;

    await sendLog('threadCreate', Guild, thread.guild, thread);
};
