'use strict';

const GuildModel = require('../models/guild');
const sendLog = require('../utils/sendLog');

module.exports = async (_client, oldChannel, newChannel) => {
    // If guild is not available because of outage return
    if (!newChannel.guild.available) return;

    const Guild = await GuildModel.findById(newChannel.guild.id);
    if (!Guild) return;

    await sendLog('channelUpdate', Guild, newChannel.guild, [oldChannel, newChannel]);
};
