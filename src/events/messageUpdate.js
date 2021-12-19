'use strict';

const GuildModel = require('../models/guild');
const sendLog = require('../utils/sendLog');

module.exports = async (_client, oldMessage, newMessage) => {
    // If guild is not available because of outage return
    if (!newMessage.guild.available) return;

    if (newMessage.channel.type !== 'GUILD_TEXT') return;

    // Return in case of uncached message
    if (!oldMessage.content) return;

    // Return if newly edited message is the same as before
    if (oldMessage.content === newMessage.content) return;

    // Return if message is edited by bot
    if (newMessage.author.bot) return;

    const Guild = await GuildModel.findById(newMessage.guild.id);
    if (!Guild) return;

    await sendLog('messageUpdate', Guild, newMessage.guild, [oldMessage, newMessage]);
};
