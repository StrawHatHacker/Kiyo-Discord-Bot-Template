'use strict';

const parseMessageFilter = require('../utils/parseMessageFilter');
const checkPermissions = require('../utils/checkForPermissions');
const errorHandler = require('../utils/messageErrorHandler');
const databaseUtils = require('../utils/database');
const onCooldown = require('../utils/onCooldown');
const sendLog = require('../utils/sendLog');

module.exports = async (client, message) => {
    // If guild is not available becase of outage return
    if (!message.guild.available) return;

    // If message came from another bot or it was from a non *text* channel, ignore it
    if (message.author.bot || message.channel.type !== 'GUILD_TEXT') return;

    // Fetching or creating a guild and the user if they don't exist in the database already
    const Guild = await databaseUtils.guild.findOneOrCreate(message.guild.id);
    const User = await databaseUtils.user.findOneOrCreate(message.author.id);

    // If the message is the bot mention return the prefix
    if (message.content === `<@!${client.user.id}>`) return message.channel.send(`My prefix in this server is \`${Guild.prefix}\``);

    // Check if the message contains filtered words
    const wordsFound = parseMessageFilter(message, Guild);
    if (wordsFound) {
        await sendLog('filter', Guild, message.guild, [message.member, wordsFound], null, null);
        return;
    }

    // If message doesn't start with prefix, ignore it
    if (!message.content.toLowerCase().startsWith(Guild.prefix)) return;

    /*   str   array                     Slice off the prefix      Split at one or more spaces*/
    let [cmd, ...args] = message.content.slice(Guild.prefix.length).split(/\s+/g);
    cmd = cmd.toLowerCase(); // Lowercase the cmd to match it with lowercase aliases

    // Find the command
    const commandToRun = client.commands.find(c => c.aliases.includes(cmd) || c.name.toLowerCase() === cmd);
    if (!commandToRun) return;

    const { name, requiredPermissions, cooldown, run } = commandToRun;

    // Check both member and bot permissions before executing the command
    if (!checkPermissions(message, name, requiredPermissions)) return;

    // If command has a cooldown, check if the user is on cooldown
    if (cooldown && onCooldown(name, message.author.id, cooldown) === true) return message.channel.send('You are on cooldown');

    // The differnce between cleanArgs and args is that cleanArgs doen't trim spaces or newlines
    // So it's used for multiline input or input that needs to exactly how the user intended
    /*   ,    array                        Slice off the prefix      Split at spaces*/
    let [, ...cleanArgs] = message.content.slice(Guild.prefix.length).split(/\s/g);

    // Run the command
    run({ message, cmd, client, args, cleanArgs: cleanArgs.join(' '), Guild, User })
        .catch(e => errorHandler(e, message));
};
