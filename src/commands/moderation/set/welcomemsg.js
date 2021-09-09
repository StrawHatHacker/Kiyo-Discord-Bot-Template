'use strict';

const stripToID = require('../../../utils/stripToID');
const EmbedModel = require('../../../models/embed');
const Err = require('../../../classes/Err');

module.exports = {
    name: 'WelcomeMsg',
    description: 'Configure welcome messages',
    aliases: ['welcomemsg'],
    syntax: 'welcomemsg <"channel" or "embed name">',
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

            await Guild.updateOne({ welcome_embed_id: Embed._id });
            return await message.channel.send('Embed set as welcome message');

        } else if (channel) {

            await Guild.updateOne({ welcome_channel_id: channel.id });
            return await message.channel.send(`Welcome channel set (<#${channel.id}>)`);

        } else {

            throw new Err().notFound().inputErr().setMessage('No Embed name or Channel found');

        }
    }
};
