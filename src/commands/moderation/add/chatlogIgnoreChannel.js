'use strict';

const stripToID = require('../../../utils/stripToID');
const { COMMAND_PERMS } = require('../../../config');
const Embed = require('../../../classes/Embed');
const Err = require('../../../classes/Err');

module.exports = {
    name: 'addchatlogignorechannel',
    description: 'Add a channel to the chatlog ignore list. Messages in channels in the chatlog ignore list will not be logged.',
    aliases: [],
    syntax: 'addchatlogignorechannel <channel>',
    requiredPermissions: {
        user: COMMAND_PERMS.addchatlogignorechannel.user,
        client: []
    },
    cooldown: 2000,
    async run({ message, args, Guild }) {
        let channelInput = args[0];
        if (!channelInput) return;

        const guildChannel = message.guild.channels.cache.get(stripToID(channelInput));
        if (!guildChannel) throw new Err().inputErr().channelNotFound();

        if (Guild.chatlog_ignore_channels.includes(guildChannel.id)) throw new Err().inputErr().channelAlreadyExists('in the chatlog ignore list.');
        if (Guild.chatlog_ignore_channels.length >= 50) throw new Err().inputErr().setMessage('You cannot add more than 50 channels to the chatlog ignore list.');

        await Guild.updateOne({
            $push: {
                chatlog_ignore_channels: guildChannel.id
            }
        });

        const e = new Embed().setDescription(`<#${guildChannel.id.toString()}> added in the chatlog ignore list.`).isSuccess();
        await message.channel.send({ embeds: [e] });
    }
};
