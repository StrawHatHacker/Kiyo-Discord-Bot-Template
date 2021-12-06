'use strict';

const GuildModel = require('../models/guild');
const sendLog = require('../utils/sendLog');

module.exports = async (_client, ban) => {
    if (ban.partial) await ban.fetch();

    // If guild is not available because of outage return
    if (!ban.guild.available) return;

    const Guild = await GuildModel.findById(ban.guild.id);
    if (!Guild) return;

    await sendLog('guildBanRemove', Guild, ban.guild, ban);
};
