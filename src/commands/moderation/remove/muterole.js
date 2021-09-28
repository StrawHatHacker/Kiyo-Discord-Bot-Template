'use strict';

const stripToID = require('../../../utils/stripToID');
const { COMMAND_PERMS } = require('../../../config');
const Embed = require('../../../classes/Embed');

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

        await Guild.updateOne({
            $pull: {
                mute_roles: roleID
            }
        });

        const e = new Embed().setDescription(`<@&${roleID}> removed from mute roles`).isSuccess();
        await message.channel.send({ embeds: [e] });
    }
};
