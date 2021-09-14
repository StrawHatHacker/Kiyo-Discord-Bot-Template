'use strict';

const formatEmbed = require('../utils/formatEmbed');
const GuildModel = require('../models/guild');
const EmbedModel = require('../models/embed');
const Embed = require('../classes/Embed');

module.exports = async (_client, member) => {
    const Guild = await GuildModel.findById(member.guild.id);
    if (!Guild) return;

    if (!Guild.features.welcome_messages) return;
    if (Guild.welcome_channel_id === null || Guild.welcome_embed_id === null) return;

    const channel = member.guild.channels.cache.get(Guild.welcome_channel_id);
    const EmbedProps = await EmbedModel.findById(Guild.welcome_embed_id);

    if (!channel || !Embed) return;

    const formattedEmbedProps = formatEmbed(EmbedProps, member);

    await channel.send({ content: EmbedProps.content, embeds: [new Embed(formattedEmbedProps)] }).catch(() => null);
};
