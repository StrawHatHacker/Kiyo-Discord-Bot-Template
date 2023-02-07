'use strict';

const stripToID = require('../../../utils/stripToID');
const { COMMAND_PERMS } = require('../../../config');
const Embed = require('../../../classes/Embed');
const Err = require('../../../classes/Err');

module.exports = {
    name: 'addlinkfilterchannel',
    description: 'Add a channel to the link filter list. Messages that contain links in channels in the link filter list will be deleted.',
    aliases: [],
    syntax: 'addlinkfilterchannel <channel>',
    requiredPermissions: {
        user: COMMAND_PERMS.addlinkfilterchannel.user,
        client: []
    },
    cooldown: 2000,
    async run({ message, args, Guild }) {
        let channelInput = args[0];
        if (!channelInput) return;

        const guildChannel = message.guild.channels.cache.get(stripToID(channelInput));
        if (!guildChannel) throw new Err().inputErr().channelNotFound();

        if (Guild.link_filter_channels.includes(guildChannel.id)) throw new Err().inputErr().channelAlreadyExists('in the link filter list.');
        if (Guild.link_filter_channels.length >= 100) throw new Err().inputErr().setMessage('You cannot add more than 100 channels to the link filter list.');

        await Guild.updateOne({
            $push: {
                link_filter_channels: guildChannel.id
            }
        });
        Guild.link_filter_channels.push(guildChannel.id);

        const e = new Embed().setDescription(`<#${guildChannel.id.toString()}> added in the link filter list.`).isSuccess();
        await message.channel.send({ embeds: [e] });
    }
};
