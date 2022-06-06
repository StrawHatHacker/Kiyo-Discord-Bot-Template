'use strict';

const stripToID = require('../../../utils/stripToID');
const { COMMAND_PERMS } = require('../../../config');
const Embed = require('../../../classes/Embed');
const Err = require('../../../classes/Err');

module.exports = {
    name: 'removemuterole',
    description: 'Remove a mute role',
    aliases: [],
    syntax: 'removemuterole <role>',
    requiredPermissions: {
        user: COMMAND_PERMS.removemuterole.user,
        client: []
    },
    async run({ message, args, Guild }) {
        const roleInput = args[0];
        if (!roleInput) return;

        const roleID = stripToID(roleInput);
        if (!Guild.mute_roles.includes(roleID)) throw new Err(400).inputErr().setMessage('That role is not in the mute role list.');

        await Guild.updateOne({
            $pull: {
                mute_roles: roleID
            }
        });

        const e = new Embed().setDescription(`<@&${roleID}> removed from mute roles`).isSuccess();
        await message.channel.send({ embeds: [e] });
    }
};
