'use strict';

const checkPermissions = require('../utils/checkForPermissions');
const errorHandler = require('../utils/messageErrorHandler');
const databaseUtils = require('../utils/database');
const GuildModel = require('../models/guild');

module.exports = async (client, message) => {
    // If message came from another bot or it was from a non *text* channel, ignore it
    if (message.author.bot || message.channel.type !== 'GUILD_TEXT') return;

    // Fetching or creating if doesn't exist a Guild in the database
    const Guild = await databaseUtils.guild.findOneOrCreate(GuildModel, message.guild.id);

    // If the message is the bot mention return the prefix
    if (message.content === `<@!${client.user.id}>`) return message.channel.send(`My prefix on this server is \`${Guild.prefix}\``);

    // If message doesn't start with prefix, ignore it
    if (!message.content.toLowerCase().startsWith(Guild.prefix)) return;

    /*   str   array                     Slice off the prefix      Split at one or more spaces*/
    let [cmd, ...args] = message.content.slice(Guild.prefix.length).split(/\s+/g);
    cmd = cmd.toLowerCase(); // Lowercase the cmd to match it with lowercase aliases

    // Looping through all available commands
    for (const { name, run, aliases, requiredPermissions } of client.commands) {

        // If cmd in not in aliases skip this command or not in command name
        if (!aliases.includes(cmd) && name.toLowerCase() !== cmd) continue;

        // Checking both member and bot permissions before executing the command
        if (!checkPermissions(message, name, requiredPermissions)) return;

        /*   ,    array                        Slice off the prefix      Split at spaces*/
        let [, ...cleanArgs] = message.content.slice(Guild.prefix.length).split(/\s/g);

        // Run the command
        return run({ message, cmd, client, args, cleanArgs: cleanArgs.join(' '), Guild }).catch(e => errorHandler(e, message));
    }
};
