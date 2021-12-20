'use strict';

const { COMMAND_PERMS } = require('../../../config');
const CaseModel = require('../../../models/case');
const Embed = require('../../../classes/Embed');
const Err = require('../../../classes/Err');

module.exports = {
    name: 'removecase',
    description: 'Remove a case',
    aliases: [],
    syntax: 'removecase <case ID>',
    requiredPermissions: {
        user: COMMAND_PERMS.removecase.user,
        client: []
    },
    cooldown: 2000,
    async run({ message, args }) {
        let caseNumberInput = args[0];
        if (!caseNumberInput) return;

        const caseNumber = Number(caseNumberInput);
        if (isNaN(caseNumber)) throw new Err().inputErr().notANumber('Case ID');

        await CaseModel.updateOne({
            guild_id: message.guild.id,
            case: caseNumber
        }, {
            deleted: true
        });

        const e = new Embed().setDescription(`**Case entry with ID \`${caseNumber}\` has been removed**`).isSuccess();
        await message.channel.send({ embeds: [e] });
    }
};
