'use strict';

// eslint-disable-next-line no-unused-vars
const { Snowflake } = require('discord.js');
const WarnModel = require('../models/warn');

/**
 * Creates a new warn document, that increments the case per guild
 * @param {Snowflake} guild_id The guild that the user was warned in
 * @param {Snowflake} user_id The user who was warned
 * @param {Snowflake} moderator The moderator performing the action
 * @param {String} reason The reason the user was warned
 * @param {('warn'|'ban'|'kick'|'softban'|'hackban'|'mute')} warn_type The type of warn
 * @returns {Promise<Error|null>} Do not catch this. Fix the code for your use case instead
 */
module.exports = async (guild_id, user_id, moderator, reason, warn_type) => {
    if (!guild_id || !user_id || !moderator || !reason)
        throw new Error('Missing parameters');

    if (
        typeof guild_id !== 'string' ||
        typeof user_id !== 'string' ||
        typeof moderator !== 'string' ||
        typeof reason !== 'string'
    )
        throw new Error('Invalid parameters');

    try {
        const WarnCount = await WarnModel.countDocuments({ guild_id });

        await WarnModel.create({
            user_id,
            guild_id,
            moderator,
            reason,
            warn_type,
            case: WarnCount + 1,
        });

        return null;
    } catch (error) {
        throw new Error(error);
    }
};
