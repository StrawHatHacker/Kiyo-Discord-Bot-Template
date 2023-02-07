'use strict';

const stripToID = require('../../../utils/stripToID');
const EmbedModel = require('../../../models/embed');
const Err = require('../../../classes/Err');

module.exports = {
    name: 'setleavemsg',
    description: 'Configure leave message functionality',
    aliases: [],
    syntax: 'setleavemsg <"channel" or "embed name">',
    requiredPermissions: {
        user: ['ADMINISTRATOR'],
        client: []
    },
    async run({ message, args, Guild }) {
        let input = args[0];
        if (!input) throw new Err(400).inputErr().setMessage('Input a channel or embed name');

        const Embed = await EmbedModel.findOne({ name: input });
        const channel = message.guild.channels.cache.get(stripToID(input));

        if (Embed) {

            await Guild.updateOne({ leave_embed_id: Embed._id });
            Guild.leave_embed_id = Embed._id;
            return await message.channel.send('Embed set as leave message');

        } else if (channel) {

            await Guild.updateOne({ leave_channel_id: channel.id });
            Guild.leave_embed_id = channel._id;
            return await message.channel.send(`Leave channel set (<#${channel.id}>)`);

        } else {

            throw new Err().notFound().inputErr().setMessage('No Embed name or Channel found');

        }
    }
};
