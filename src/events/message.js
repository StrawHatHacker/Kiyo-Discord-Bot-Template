'use strict';

const errorHandler = require('../utils/messageErrorHandler');
const Permissions = require('../classes/Permissions');
const GuildModel = require('../models/guild');
const utils = require('../utils/database');

module.exports = async (Kiyo, message) => {
    if (message.author.bot || message.channel.type === 'dm') return; // If message came from bot or in a dm channel, ignore it
    if (!message.content.toLowerCase().startsWith(Kiyo.globalPrefix)) return; // If message doesn't start with prefix, ignore it

    // Fetching or creating if doesn't exist a Guild in the database
    const Guild = await utils.guild.findOneOrCreate(GuildModel, message.guild.id);

    /*   str   array                     Slicing off the prefix          Spliting at spaces*/
    let [cmd, ...args] = message.content.slice(Kiyo.globalPrefix.length).split(/\s+/g);
    cmd = cmd.toLowerCase(); // Lowercasing the cmd to match it with lowercase aliases

    // Looping through all available commands
    for (const { name, run, aliases, requiredPermissions } of Kiyo.commands) {
        if (!aliases.includes(cmd)) continue; // If cmd in not in aliases skip this command

        try {
            const userhasPermission = new Permissions(message.member.permissions)
                .filterKeyPerms()
                .userhasPermission(requiredPermissions.user);

            if (!userhasPermission)
                return message.member.send(`You don't have permission to run the \`${name}\` command in **${message.guild.name}**`);

            const clientHasPermissions = new Permissions(message.guild.me.permissions)
                .permsToArray()
                .clientHasPermission(requiredPermissions.client);

            if (!clientHasPermissions)
                return message.member.send(`${Kiyo.user.username} doesn't have permission to run the \`${name}\` command in **${message.guild.name}**`);

            // Run the command
            run({ message, Kiyo, args }).catch(e => errorHandler(e, message));

        } catch (error) {
            // Why are we ignoring errors here?
            // Because the only errors that will be handled here, are from when the ".send" method fails and we don't care about it at all!
            // If the command execution fails, it will be handled by it's own errorHandler
            // If you want to work on this code, you should probably handle this catch <3
            return;
        }
    }
};