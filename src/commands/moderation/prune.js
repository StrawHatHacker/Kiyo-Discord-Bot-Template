'use strict';

const stripToID = require('../../utils/stripToID');
const { COMMAND_PERMS } = require('../../config');
const Embed = require('../../classes/Embed');
const Err = require('../../classes/Err');

module.exports = {
    name: 'prune',
    description: 'Delete messages from the current channel or delete messages from a specific user',
    aliases: ['clear', 'purge'],
    syntax: 'prune <amount> [member]',
    requiredPermissions: {
        user: COMMAND_PERMS.prune.user,
        client: ['MANAGE_MESSAGES']
    },
    cooldown: 5000,
    async run({ message, args }) {
        const amountInput = args[0];
        const memberInput = args[1];
        if (!amountInput) return;

        const amount = Number(amountInput);
        if (isNaN(amount)) throw new Err().inputErr().notANumber('`Amount`');
        if (amount < 1) throw new Err().inputErr().notPositive('`Amount`');
        if (amount > 100) throw new Err().inputErr().setMessage('`Amount` cannot be greater than 100');

        if (memberInput) {
            const memberIDToPrune = stripToID(memberInput);
            const messages = await message.channel.messages.fetch({ limit: 100 });
            if (messages.size === 0) throw new Err(404).inputErr().setMessage('There are no messages in this channel');

            let messagesFromUser = [...messages.values()].filter(m => m.author.id === memberIDToPrune && !m.pinned);
            if (messagesFromUser.length === 0) throw new Err(400).inputErr().setMessage('No messages from that user were found');

            messagesFromUser = messagesFromUser.slice(0, amount);

            await message.delete();
            await message.channel.bulkDelete(messagesFromUser.map(m => m.id));

            const msg = await message.channel.send({ embeds: [makeDataEmbed(messagesFromUser)] });
            setTimeout(() => msg.delete(), 10000);

        } else {
            let messages = await message.channel.messages.fetch({ limit: amount }, true);
            messages = messages.filter(m => !m.pinned);

            if (messages.size === 0) throw new Err(404).inputErr().setMessage('There are no messages in this channel');

            await message.delete();
            await message.channel.bulkDelete(messages);

            const msg = await message.channel.send({ embeds: [makeDataEmbed([...messages.values()])] });
            setTimeout(() => msg.delete(), 10000);
        }
    }
};

const makeDataEmbed = (messages) => {
    const e = new Embed().setTitle(`Deleted **${messages.length} messages**`);
    let users = {};

    // You don't have to understand what's happening here, it just calculates messages from users
    messages.forEach(m => users[m.author.tag] ? users[m.author.tag] += 1 : users[m.author.tag] = 1);

    const formattedData = Object.entries(users).map(([k, v]) => `● **${k}** - ${v}`).join('\n');

    e.setDescription(`${formattedData}`);

    return e;
};
