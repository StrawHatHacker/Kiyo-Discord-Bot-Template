'use strict';

const { COMMAND_PERMS } = require('../../../config');
const Embed = require('../../../classes/Embed');
const Err = require('../../../classes/Err');

module.exports = {
    name: 'removefilter',
    description: 'Remove a word from the word filter',
    aliases: [],
    syntax: 'removefilter <word>',
    requiredPermissions: {
        user: COMMAND_PERMS.removeFilter.user,
        client: []
    },
    async run({ message, args, Guild }) {
        let wordInput = args[0];
        if (!wordInput) return;

        wordInput = wordInput.toLowerCase();

        if (!Guild.filtered_words.includes(wordInput)) throw new Err(400).inputErr().setMessage('That word is not in the word filter.');

        await Guild.updateOne({ $pull: { filtered_words: wordInput } });

        const e = new Embed().setDescription(`**Word ||${wordInput}|| has been removed**`).isSuccess();
        await message.channel.send({ embeds: [e] });
    }
};
