'use strict';

const GuildModel = require('../models/guild');
const sendLog = require('../utils/sendLog');

module.exports = async (_client, oldRole, newRole) => {
    // If guild is not available because of outage return
    if (!newRole.guild.available) return;

    const Guild = await GuildModel.findById(newRole.guild.id);
    if (!Guild) return;

    await sendLog('roleUpdate', Guild, newRole.guild, [oldRole, newRole]);
};
