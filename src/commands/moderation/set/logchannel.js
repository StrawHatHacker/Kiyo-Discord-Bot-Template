'use strict';

const { and, or } = require('../../../utils/stringManipulation');
const stripToID = require('../../../utils/stripToID');
const Err = require('../../../classes/Err');

const logTypes = ['moderation', 'message', 'server', 'member'];

module.exports = {
    name: 'setlogchannel',
    description: `Set the log channels. Type of logs are: ${and(logTypes, '"')}`,
    aliases: [],
    syntax: 'setlogchannel <log type> <channel>',
    requiredPermissions: {
        user: ['ADMINISTRATOR'],
        client: []
    },
    async run({ message, args, Guild }) {
        let logTypeInput = args[0];
        let channelInput = args[1];
        if (!logTypeInput || !channelInput) return;

        logTypeInput = logTypeInput.toLowerCase();
        channelInput = stripToID(channelInput);

        if (!logTypes.includes(logTypeInput))
            throw new Err(400).inputErr().setMessage(`"Log type" is neither ${or(logTypes, '"')}`);

        const channel = message.guild.channels.cache.get(channelInput);
        if (!channel) throw new Err().inputErr().channelNotFound();

        await Guild.updateOne({
            [`${logTypeInput}_log_channel_id`]: channel.id
        });
        Guild[`${logTypeInput}_log_channel_id`] = channel.id;

        await message.channel.send(`${channel.toString()} set as ${logTypeInput} log`);
    }
};
