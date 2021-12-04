'use strict';

const hasModeratorPerms = require('../../utils/hasModeratorPerms');
const safeFindMember = require('../../utils/safeFindMember');
const createCase = require('../../utils/createCase');
const sendLog = require('../../utils/sendLog');
const Embed = require('../../classes/Embed');
const Err = require('../../classes/Err');

module.exports = {
    name: 'ban',
    description: 'Ban a member from the server',
    aliases: [],
    syntax: 'ban <member> [reason]',
    requiredPermissions: {
        user: ['BAN_MEMBERS'],
        client: ['BAN_MEMBERS']
    },
    async run({ message, args, Guild }) {
        const memberInput = args[0];
        if (!memberInput) return;

        const memberToBan = await safeFindMember(message, memberInput);
        if (!memberToBan) throw new Err().inputErr().memberNotFound();

        if (!memberToBan.bannable) throw new Err(400).inputErr().setMessage('Member is higher in the role hierarchy');
        if (hasModeratorPerms(memberToBan)) throw new Err(400).inputErr().setMessage('Member has moderation permissions');

        const reason = args.length > 1 ? args.slice(1).join(' ') : 'No reason provided';

        await memberToBan.send(`You have been banned from **${message.guild.name}** for: *${reason}*`).catch(() => null);
        await memberToBan.ban({ reason, days: 7 });

        await createCase(message.guild.id, memberToBan.id, message.author.id, reason, 'ban');

        const e = new Embed().setDescription(`**${memberToBan.user.tag} has been banned**`).isSuccess();
        await message.channel.send({ embeds: [e] });

        await sendLog('ban', Guild, message.guild, memberToBan, message.member, reason);
    }
};
