'use strict';

const stripToID = require('../../../utils/stripToID');
const { COMMAND_PERMS } = require('../../../config');
const Embed = require('../../../classes/Embed');

module.exports = {
    name: 'removeautorole',
    description: 'Remove an autorole',
    aliases: [],
    syntax: 'removeautorole <role>',
    requiredPermissions: {
        user: COMMAND_PERMS.removeautorole.user,
        client: []
    },
    async run({ message, args, Guild }) {
        const roleInput = args[0];
        if (!roleInput) return;

        const roleID = stripToID(roleInput);

        await Guild.updateOne({
            $pull: {
                autoroles: roleID
            }
        });
        Guild.autoroles.pull(roleID);

        const e = new Embed().setDescription(`<@&${roleID}> removed from autoroles`).isSuccess();
        await message.channel.send({ embeds: [e] });
    }
};
