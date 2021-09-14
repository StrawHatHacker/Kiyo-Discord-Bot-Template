'use strict';

const stripToID = require('../utils/stripToID');
const { Message } = require('discord.js');

/**
 * @param {Message} message 
 * @param {String} arg 
 * @returns {Promise<GuildMember>}
 */
module.exports = async (message, arg) => {
    if (!(message instanceof Message)) throw new Error('Parameter `message` is not instance of `Message`');

    try {
        //Strip it from all characters except numbers, basically trying to get a 1234567890 from <@1234567890>
        const targetMemberID = stripToID(arg);
        if (!targetMemberID) return null;

        let m = message.guild.members.cache.find(m => m.user.tag === arg); // Works for tags like -> Sophie#3287
        if (m) return m;

        m = await message.guild.members.fetch({ user: targetMemberID }); // Works for mentioned users and IDs
        if (m) return m;

        return null;

    } catch (error) {
        return null;
    }
};
