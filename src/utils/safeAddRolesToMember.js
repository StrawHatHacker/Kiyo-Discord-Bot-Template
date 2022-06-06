'use strict';

const { GuildMember } = require('discord.js');

/**
 * @param {GuildMember} member 
 * @param {string[]} roles 
 * @returns {Promise<void>}
 */
module.exports = async (member, roles) => {
    if (!(member instanceof GuildMember)) throw new Error('Parameter `member` is not instance of `GuildMember`');
    if (!Array.isArray(roles)) throw new Error('Parameter `roles` is not an array');

    try {
        await member.roles.add(roles);

    } catch (error) {

        for (const r of roles) {
            if (!member.roles.cache.has(r)) await member.roles.add(r).catch(() => null);
        }

    }
};
