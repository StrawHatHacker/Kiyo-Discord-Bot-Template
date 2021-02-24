'use strict';

const utils = require('../utils/database');
const GuildModel = require('../models/guild');

module.exports = async (Kiyo, message) => {
    if (message.author.bot || message.channel.type === 'dm') return;
    if (!message.content.toLowerCase().startsWith(Kiyo.globalPrefix)) return;

    const Guild = await utils.guild.findOneOrCreate(GuildModel, [message.guild.id]);

    const [cmd, ...args] = message.content
        .toLowerCase()
        .slice(Kiyo.globalPrefix.length)
        .split(/\s+/g);

    for (const { name, run } of Kiyo.commands) {
        if (name !== cmd) continue;

        run({ message, Kiyo, args }).catch(e => errorHandler(e, message));
    }
};

const errorHandler = (e, m) => {
    // 404 Not Found
    if (e.httpStatus === 404) m.channel.send(`${e.name}: ${e.message}`);

    // 403 Missing Permissions
    // BE CAREFUL, you might not see errors in your console because of this line
    // usually triggers when the bot doesn't have permissions to do something
    else if (e.httpStatus === 403) return;

    // All other errors
    else {
        console.log(e);
        m.channel.send('Unknown Error');
    }
};