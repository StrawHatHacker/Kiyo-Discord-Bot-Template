'use strict';

const createCase = require('../../../utils/createCase');
const stripToID = require('../../../utils/stripToID');
const { COMMAND_PERMS } = require('../../../config');
const Embed = require('../../../classes/Embed');
const Err = require('../../../classes/Err');

module.exports = {
    name: 'addcase',
    description: 'Manually add a case',
    aliases: [],
    syntax: 'addcase <user id> [reason]',
    requiredPermissions: {
        user: COMMAND_PERMS.addcase.user,
        client: []
    },
    cooldown: 5000,
    async run({ message, args, client }) {
        let userInput = args[0];
        if (!userInput) return;
        if (args.length < 2) throw new Err(400).syntaxErr().setMessage('You must provide a reason when adding a case.');

        userInput = stripToID(userInput);

        const user = await client.users.fetch(userInput, { cache: false }); // Throws and sends API error automatically
        const reason = args.slice(1).join(' ');

        await createCase(message.guild.id, user.id, message.author.id, reason, 'custom');

        const e = new Embed().setDescription(`**Case entry for ${user.tag} has been added**`).isSuccess();
        await message.channel.send({ embeds: [e] });
    }
};
