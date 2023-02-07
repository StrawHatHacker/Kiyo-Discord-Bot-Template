'use strict';

const db = require('../utils/database');

module.exports = async (client, guild) => {
    // If guild is not available because of outage return
    if (!guild.available) return;

    // Adding every guild the bot joins into the db
    const Guild = await db.guild.findOneOrCreate(guild.id, client.guildCache);

    // Resetting the prefix everytime the bot joins a new guild
    await Guild.updateOne({ prefix: '>' });
};
