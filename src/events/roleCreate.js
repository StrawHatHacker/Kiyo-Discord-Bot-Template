'use strict';

const GuildModel = require('../models/guild');
const sendLog = require('../utils/sendLog');

module.exports = async (_client, role) => {
    // If guild is not available because of outage return
    if (!role.guild.available) return;

    const Guild = await GuildModel.findById(role.guild.id);
    if (!Guild) return;

    await sendLog('roleCreate', Guild, role.guild, role);
};
