'use strict';

const hasModeratorPerms = require('../../../utils/hasModeratorPerms');
const stripToID = require('../../../utils/stripToID');
const { COMMAND_PERMS } = require('../../../config');
const Embed = require('../../../classes/Embed');
const Err = require('../../../classes/Err');

module.exports = {
    name: 'addautorole',
    description: 'Add a new autorole. Autoroles get assigned to a member when they join the server',
    aliases: [],
    syntax: 'addautorole <role>',
    requiredPermissions: {
        user: COMMAND_PERMS.addautorole.user,
        client: []
    },
    cooldown: 2000,
    async run({ message, args, Guild }) {
        const roleInput = args[0];
        if (!roleInput) return;

        const guildRole = message.guild.roles.cache.get(stripToID(roleInput));
        if (!guildRole) throw new Err().inputErr().roleNotFound();

        if (Guild.autoroles.includes(guildRole.id)) throw new Err().inputErr().roleAlreadyExists('in the autorole list.');

        if (hasModeratorPerms(guildRole))
            throw new Err(400).inputErr().setMessage('Role has moderation permissions. Bot should not assign roles that can elevate the permissions of a user.');

        await Guild.updateOne({
            $push: {
                autoroles: guildRole.id
            }
        });

        const e = new Embed().setDescription(`${guildRole.toString()} added to autoroles`).isSuccess();
        await message.channel.send({ embeds: [e] });
    }
};
