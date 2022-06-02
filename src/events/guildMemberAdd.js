'use strict';

const formatEmbed = require('../utils/formatEmbed');
const GuildModel = require('../models/guild');
const EmbedModel = require('../models/embed');
const sendLog = require('../utils/sendLog');
const Embed = require('../classes/Embed');

module.exports = async (_client, member) => {
    // If guild is not available because of outage return
    if (!member.guild.available) return;

    const Guild = await GuildModel.findById(member.guild.id);
    if (!Guild) return;

    await sendLog('guildMemberAdd', Guild, member.guild, member).catch(() => null);

    if (!Guild.features.welcomemessages) return;
    if (Guild.welcome_channel_id === null || Guild.welcome_embed_id === null) return;

    const channel = member.guild.channels.cache.get(Guild.welcome_channel_id);
    const EmbedProps = await EmbedModel.findById(Guild.welcome_embed_id);

    if (!channel || !EmbedProps) return;

    const formattedEmbedProps = formatEmbed(EmbedProps, member);

    await channel.send({ content: EmbedProps.content, embeds: [new Embed(formattedEmbedProps)] }).catch(() => null);
};
