'use strict';

const GuildModel = require('../models/guild');
const sendLog = require('../utils/sendLog');

module.exports = async (_client, message) => {
    // If guild is not available because of outage return
    if (!message.guild.available) return;

    // If the message has no content (uncached) return
    if (!message.content) return;

    // Ignore common pick commands
    if (message.content === '.pick' || message.content === ',pick') return;

    if (message.author.bot) return;

    if (message.channel.type !== 'GUILD_TEXT') return;

    const Guild = await GuildModel.findById(message.guild.id);
    if (!Guild) return;

    await sendLog('messageDelete', Guild, message.guild, message);
};
