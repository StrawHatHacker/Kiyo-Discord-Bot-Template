'use strict';

const stripToID = require('../../../utils/stripToID');
const { COMMAND_PERMS } = require('../../../config');
const Embed = require('../../../classes/Embed');
const Err = require('../../../classes/Err');

module.exports = {
    name: 'addattachmentonlychannel',
    description: 'Add a channel to the attachment only channel list. Messages in channels in the attachment only channel list that don\'t have an attachment(image, audio, etc...) will be deleted.',
    aliases: [],
    syntax: 'addattachmentonlychannel <channel>',
    requiredPermissions: {
        user: COMMAND_PERMS.addattachmentonlychannel.user,
        client: []
    },
    cooldown: 2000,
    async run({ message, args, Guild }) {
        let channelInput = args[0];
        if (!channelInput) return;

        const guildChannel = message.guild.channels.cache.get(stripToID(channelInput));
        if (!guildChannel) throw new Err().inputErr().channelNotFound();

        if (Guild.attachment_only_channels.includes(guildChannel.id)) throw new Err().inputErr().channelAlreadyExists('in the attachment only channel list.');
        if (Guild.attachment_only_channels.length >= 100) throw new Err().inputErr().setMessage('You cannot add more than 100 channels to the attachment only channel list.');

        await Guild.updateOne({
            $push: {
                attachment_only_channels: guildChannel.id
            }
        });

        const e = new Embed().setDescription(`<#${guildChannel.id.toString()}> added in the attachment only channel list.`).isSuccess();
        await message.channel.send({ embeds: [e] });
    }
};
