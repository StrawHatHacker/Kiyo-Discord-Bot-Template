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

    await sendLog('guildMemberRemove', Guild, member.guild, member).catch(() => null);

    if (!Guild.features.leavemessages) return;
    if (Guild.leave_channel_id === null || Guild.leave_embed_id === null) return;

    const channel = member.guild.channels.cache.get(Guild.leave_channel_id);
    const EmbedProps = await EmbedModel.findById(Guild.leave_embed_id);

    if (!channel || !EmbedProps) return;

    const formattedEmbedProps = formatEmbed(EmbedProps, member);
    await channel.send({ content: EmbedProps.content || null, embeds: [new Embed(formattedEmbedProps)] }).catch(console.log);
};
