'use strict';

const GuildModel = require('../models/guild');
const sendLog = require('../utils/sendLog');

module.exports = async (_client, oldGuild, newGuild) => {
    // If guild is not available because of outage return
    if (!newGuild.available) return;

    const Guild = await GuildModel.findById(newGuild.id);
    if (!Guild) return;

    await sendLog('guildUpdate', Guild, newGuild, [oldGuild, newGuild]);
};
