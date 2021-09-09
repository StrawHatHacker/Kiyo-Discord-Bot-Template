'use strict';

const { GuildMember, Collection, Message } = require('discord.js');

/**
 * @param {Message} message 
 * @param {String} arg 
 * @returns {GuildMember}
 */
module.exports = async (message, arg) => {
    if (!(message instanceof Message)) throw new Error('Parameter `message` is not instance of `Message`');

    //Strip it from all characters except numbers, basically trying to get a 1234567890 from <@1234567890>
    const targetMemberID = arg.replace(/[^0-9]+/g, '');

    const promise1 = message.guild.members.fetch({ query: arg, limit: 1 }); // Works for similar names like -> Input Soph, returns user with name Sophie
    const promise2 = message.guild.members.cache.find(m => m.user.tag === arg); // Works for tags like -> Sophie#3287
    const promise3 = message.guild.members.fetch(targetMemberID); // Works for mentioned users and IDs
    // With all the above we handle most ways a user can try to pass another user as argument

    // 1.value:Collection<GuildMember>, 2.value:GuildMember, 3.value:GuildMember
    const results = await Promise.allSettled([promise1, promise2, promise3]);
    for (const r of results) {
        if (r.status !== 'rejected') {
            if (r.value instanceof GuildMember) return r.value;
            else if (r.value instanceof Collection && r.value.size > 0) return r.value.first();
        }
    }
};
