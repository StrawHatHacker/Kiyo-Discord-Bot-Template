'use strict';

const stripToID = require('../../../utils/stripToID');
const { COMMAND_PERMS } = require('../../../config');
const Embed = require('../../../classes/Embed');
const Err = require('../../../classes/Err');

module.exports = {
    name: 'removelinkfilterchannel',
    description: 'Remove a link filter channel',
    aliases: [],
    syntax: 'removelinkfilterchannel <channel>',
    requiredPermissions: {
        user: COMMAND_PERMS.removelinkfilterchannel.user,
        client: []
    },
    async run({ message, args, Guild }) {
        const channelInput = args[0];
        if (!channelInput) return;

        const channelID = stripToID(channelInput);
        if (!Guild.link_filter_channels.includes(channelID))
            throw new Err(400).inputErr().setMessage('That channel is not in the link filter list.');

        await Guild.updateOne({
            $pull: {
                link_filter_channels: channelID
            }
        });

        const e = new Embed().setDescription(`<#${channelID}> removed from the link filter list.`).isSuccess();
        await message.channel.send({ embeds: [e] });
    }
};
