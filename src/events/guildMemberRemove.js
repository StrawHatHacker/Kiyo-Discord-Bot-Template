'use strict';

const GuildModel = require('../models/guild');
const sendLog = require('../utils/sendLog');

module.exports = async (_client, member) => {
    console.log('ok');
    // If guild is not available because of outage return
    if (!member.guild.available) return;

    const Guild = await GuildModel.findById(member.guild.id);
    if (!Guild) return;

    await sendLog('guildMemberRemove', Guild, member.guild, member);
};
