'use strict';

const GuildModel = require('../models/guild');
const sendLog = require('../utils/sendLog');

module.exports = async (_client, invite) => {
    // If guild is not available because of outage return
    if (!invite.guild.available) return;

    const Guild = await GuildModel.findById(invite.guild.id);
    if (!Guild) return;

    await sendLog('inviteCreate', Guild, invite.guild, invite);
};
