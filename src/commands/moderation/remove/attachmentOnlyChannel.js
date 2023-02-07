'use strict';

const stripToID = require('../../../utils/stripToID');
const { COMMAND_PERMS } = require('../../../config');
const Embed = require('../../../classes/Embed');
const Err = require('../../../classes/Err');

module.exports = {
    name: 'removeattachmentonlychannel',
    description: 'Remove an attachment only channel',
    aliases: [],
    syntax: 'removeattachmentonlychannel <channel>',
    requiredPermissions: {
        user: COMMAND_PERMS.removeattachmentonlychannel.user,
        client: []
    },
    async run({ message, args, Guild }) {
        const channelInput = args[0];
        if (!channelInput) return;

        const channelID = stripToID(channelInput);
        if (!Guild.attachment_only_channels.includes(channelID))
            throw new Err(400).inputErr().setMessage('That channel is not in the attachment only channel list.');

        await Guild.updateOne({
            $pull: {
                attachment_only_channels: channelID
            }
        });
        Guild.attachment_only_channels.pull(channelID);

        const e = new Embed().setDescription(`<#${channelID}> removed from the attachment only channel list.`).isSuccess();
        await message.channel.send({ embeds: [e] });
    }
};
