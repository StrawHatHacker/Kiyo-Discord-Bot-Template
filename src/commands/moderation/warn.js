'use strict';

const hasModeratorPerms = require('../../utils/hasModeratorPerms');
const safeFindMember = require('../../utils/safeFindMember');
const { COMMAND_PERMS } = require('../../config');
const Embed = require('../../classes/Embed');
const Err = require('../../classes/Err');

module.exports = {
    name: 'warn',
    description: 'Warn a member',
    aliases: [],
    syntax: 'warn <member> [reason]',
    requiredPermissions: {
        user: COMMAND_PERMS.warn.user,
        client: []
    },
    async run({ message, args }) {
        const memberInput = args[0];
        if (!memberInput) return;

        const memberToWarn = await safeFindMember(message, memberInput);
        if (!memberToWarn) throw new Err().inputErr().memberNotFound();

        if (hasModeratorPerms(memberToWarn)) throw new Err(400).inputErr().setMessage('Member has moderation permissions');

        const reason = args.length > 1 ? args.slice(1).join(' ') : 'No reason provided';

        await memberToWarn.send(`You have been warned in **${message.guild.name}** for: *${reason}*`).catch(() => null);

        const e = new Embed().setDescription(`**${memberToWarn.user.tag} has been warned**`).isSuccess();
        await message.channel.send({ embeds: [e] });
    }
};
