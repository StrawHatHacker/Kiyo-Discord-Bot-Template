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
        const wordInput = args[0].toLowerCase();
        if (!wordInput) return;

        if (!Guild.filtered_words.includes(wordInput)) throw new Err(400).inputErr().setMessage('That word is not in the word filter.');

        await Guild.updateOne({ $pull: { filtered_words: wordInput } });
        Guild.filtered_words.pull(wordInput);

        const e = new Embed().setDescription(`**Word ||${wordInput}|| has been removed**`).isSuccess();
        await message.channel.send({ embeds: [e] });
    }
};
