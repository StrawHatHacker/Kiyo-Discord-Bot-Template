'use strict';

const hasModeratorPerms = require('../../../utils/hasModeratorPerms');
const stripToID = require('../../../utils/stripToID');
const { COMMAND_PERMS } = require('../../../config');
const Embed = require('../../../classes/Embed');
const Err = require('../../../classes/Err');

module.exports = {
    name: 'addmuterole',
    description: 'Add a new mute role. Mute roles get assigned to a member with the `mute` command',
    aliases: [],
    syntax: 'addmuterole <role>',
    requiredPermissions: {
        user: COMMAND_PERMS.addmuterole.user,
        client: []
    },
    cooldown: 2000,
    async run({ message, args, Guild }) {
        const roleInput = args[0];
        if (!roleInput) return;

        const guildRole = message.guild.roles.cache.get(stripToID(roleInput));
        if (!guildRole) throw new Err().inputErr().roleNotFound();

        if (Guild.mute_roles.includes(guildRole.id)) throw new Err().inputErr().roleAlreadyExists();

        if (hasModeratorPerms(guildRole))
            throw new Err(400).inputErr().setMessage('Role has moderation permissions. Bot should not assign roles that can elevate the permissions of a user');

        await Guild.updateOne({
            $push: {
                mute_roles: guildRole.id
            }
        });

        const e = new Embed().setDescription(`${guildRole.toString()} added to mute roles`).isSuccess();
        await message.channel.send({ embeds: [e] });
    }
};
