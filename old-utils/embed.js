'use strict';

const { COMMAND_PERMS } = require('../../../config');
const EmbedModel = require('../../../models/embed');
const Embed = require('../../../classes/Embed');
const Err = require('../../../classes/Err');

module.exports = {
    name: 'makeembed',
    description: 'Create an embed and save it for future use.\n<embed properties> should be valid JSON embed properties.\nUse https://leovoel.github.io/embed-visualizer for the embed.\nUse https://codebeautify.org/jsonminifier for minifying',
    aliases: [],
    syntax: 'makeembed <embed properties>',
    requiredPermissions: {
        user: COMMAND_PERMS.makeembed.user,
        client: []
    },
    cooldown: 5000,
    async run({ message, cleanArgs }) {
        let jsonArgs;

        try { jsonArgs = JSON.parse(cleanArgs); }
        catch (error) { throw new Err(401).inputErr().jsonNotValid(); }

        const { content, embed } = jsonArgs;
        const targetEmbed = new Embed(embed);

        await message.channel.send({ content, embeds: [targetEmbed] });
        await message.channel.send('Do you want me to save this embed? (Y/N)');

        const filterYN = m => m.author.id === message.author.id && (m.content.toLowerCase() === 'y' || m.content.toLowerCase() === 'n');
        let collected = await message.channel.awaitMessages({ filter: filterYN, max: 1, time: 10000, errors: ['time'] })
            .catch(() => { throw new Err(401).timeErr().timedOut(); });

        if (!collected) return;

        const collectedMsg = collected.first();
        if (collectedMsg.content.toLowerCase() !== 'y') return message.channel.send('Cancelled');

        await message.channel.send('Let\'s give this embed a name. What do you want me to call it?');

        const filterString = m => m.author.id === message.author.id;
        collected = await message.channel.awaitMessages({ filter: filterString, max: 1, time: 10000, errors: ['time'] })
            .catch(() => { throw new Err(401).timeErr().timedOut(); });

        if (!collected) return;

        const collectedMsgContent = collected.first().content.toLowerCase();

        await EmbedModel.create({
            guildId: message.guild.id,
            content,
            name: collectedMsgContent,
            ...targetEmbed
        });

        message.channel.send(`Embed \`${collectedMsgContent}\` successfuly saved`);
    }
};
