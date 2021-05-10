'use strict';

const checkPermissions = require('../utils/checkForPermissions');
const errorHandler = require('../utils/messageErrorHandler');
const GuildModel = require('../models/guild');
const databaseUtils = require('../utils/database');

module.exports = async (client, message) => {
    if (message.author.bot || message.channel.type === 'dm') return; // If message came from bot or in a dm channel, ignore it


    // Fetching or creating if doesn't exist a Guild in the database
    const Guild = await databaseUtils.guild.findOneOrCreate(GuildModel, message.guild.id);

    // If the message is the bot mention return the prefix. Using return here since no command starts with the bot's mention anyway.
    if (message.content === `<@!${client.user.id}>`) return message.channel.send(`My prefix on this server is \`${Guild.prefix}\``);

    if (!message.content.toLowerCase().startsWith(Guild.prefix)) return; // If message doesn't start with prefix, ignore it

    /*   str   array                     Slice off the prefix      Split at one or more spaces*/
    let [cmd, ...args] = message.content.slice(Guild.prefix.length).split(/\s+/g);
    cmd = cmd.toLowerCase(); // Lowercase the cmd to match it with lowercase aliases

    // Looping through all available commands
    for (const { name, run, aliases, requiredPermissions } of client.commands) {

        // If cmd in not in aliases skip this command
        if (!aliases.includes(cmd)) continue;

        // Checking both member and bot permissions before executing the command
        if (!checkPermissions(client, message, name, requiredPermissions)) return;

        /*   ,    array                        Slice off the prefix      Split at spaces*/
        let [, ...cleanArgs] = message.content.slice(Guild.prefix.length).split(/\s/g);

        // Run the command
        run({ message, cmd, client, args, cleanArgs: cleanArgs.join(' '), Guild }).catch(e => errorHandler(e, message));
    }
};
