'use strict';

const stripToID = require('../../../utils/stripToID');
const { COMMAND_PERMS } = require('../../../config');
const Embed = require('../../../classes/Embed');
const Err = require('../../../classes/Err');

module.exports = {
    name: 'removechatlogignorechannel',
    description: 'Remove a chatlog ignore channel',
    aliases: [],
    syntax: 'removechatlogignorechannel <channel>',
    requiredPermissions: {
        user: COMMAND_PERMS.removechatlogignorechannel.user,
        client: []
    },
    async run({ message, args, Guild }) {
        const channelInput = args[0];
        if (!channelInput) return;

        const channelID = stripToID(channelInput);
        if (!Guild.chatlog_ignore_channels.includes(channelID))
            throw new Err(400).inputErr().setMessage('That channel is not in the chatlog ignore list.');

        await Guild.updateOne({
            $pull: {
                chatlog_ignore_channels: channelID
            }
        });

        const e = new Embed().setDescription(`<#${channelID}> removed from the chatlog ignore list.`).isSuccess();
        await message.channel.send({ embeds: [e] });
    }
};
