'use strict';

const stripToID = require('../../utils/stripToID');
const { COMMAND_PERMS } = require('../../config');
const Embed = require('../../classes/Embed');

module.exports = {
    name: 'unban',
    description: 'Remove the ban of a user in the server',
    aliases: [],
    syntax: 'unban <user id> [reason]',
    requiredPermissions: {
        user: COMMAND_PERMS.unban.user,
        client: ['BAN_MEMBERS']
    },
    cooldown: 5000,
    async run({ message, args }) {
        let userInput = args[0];
        if (!userInput) return;

        const guildBan = await message.guild.bans.fetch(stripToID(userInput), { cache: false }); // Throws and sends API error automatically

        const reason = args.length > 1 ? args.slice(1).join(' ') : 'No reason provided';

        await message.guild.members.unban(guildBan.user.id, reason);

        const e = new Embed().setDescription(`**${guildBan.user.tag} has been unbanned**`).isSuccess();
        await message.channel.send({ embeds: [e] });
    }
};
