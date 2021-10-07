'use strict';

const { COMMAND_PERMS } = require('../../../config');
const CaseModel = require('../../../models/case');
const Embed = require('../../../classes/Embed');
const Err = require('../../../classes/Err');

module.exports = {
    name: 'editcase',
    description: 'Edit a case\'s reason',
    aliases: [],
    syntax: 'editcase <case ID> [reason]',
    requiredPermissions: {
        user: COMMAND_PERMS.removecase.user,
        client: []
    },
    async run({ message, args }) {
        let caseNumberInput = args[0];
        if (!caseNumberInput) return;
        if (args.length < 2) throw new Err(400).syntaxErr().setMessage('You must provide a reason when editing a case.');

        const caseNumber = Number(caseNumberInput);
        if (isNaN(caseNumber)) throw new Err().inputErr().notANumber('Case ID');

        const Case = await CaseModel.findOne({
            guild_id: message.guild.id,
            case: caseNumber,
            deleted: false
        });

        if (!Case) throw new Err(404).inputErr().setMessage('Case not found.');

        const reason = args.slice(1).join(' ');

        await CaseModel.updateOne({
            guild_id: message.guild.id,
            case: caseNumber
        }, {
            reason
        });

        const e = new Embed().setDescription(`**Case entry with ID \`${caseNumber}\` has been edited**`).isSuccess();
        await message.channel.send({ embeds: [e] });
    }
};
