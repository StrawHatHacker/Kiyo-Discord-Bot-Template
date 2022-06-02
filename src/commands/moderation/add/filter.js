'use strict';

const { COMMAND_PERMS } = require('../../../config');
const Embed = require('../../../classes/Embed');
const Err = require('../../../classes/Err');

module.exports = {
    name: 'addfilter',
    description: 'Add a word the word filter',
    aliases: [],
    syntax: 'addfilter <word>',
    requiredPermissions: {
        user: COMMAND_PERMS.addFilter.user,
        client: []
    },
    async run({ message, args, Guild }) {
        let wordInput = args[0];
        if (!wordInput) throw new Err(400).syntaxErr().setMessage('You must a word to add to word filter.');

        wordInput = wordInput.toLowerCase();

        if (Guild.filtered_words.includes(wordInput)) throw new Err(400).inputErr().setMessage('That word is already in the word filter.');
        if (Guild.filtered_words.length >= 100) throw new Err(400).inputErr().setMessage('You cannot add more than 100 words to the word filter.');

        await Guild.updateOne({ $push: { filtered_words: wordInput } });

        const e = new Embed().setDescription(`**Word ||${wordInput}|| has been added**`).isSuccess();
        await message.channel.send({ embeds: [e] });
    }
};
