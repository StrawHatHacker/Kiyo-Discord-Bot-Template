'use strict';

const findTotalPageNumber = require('../../utils/findTotalPageNumber');
const DateFormatter = require('../../utils/DateFormatter');
const stripToID = require('../../utils/stripToID');
const { COMMAND_PERMS } = require('../../config');
const CaseModel = require('../../models/case');
const Embed = require('../../classes/Embed');
const Err = require('../../classes/Err');

module.exports = {
    name: 'cases',
    description: 'View the cases of a user',
    aliases: [],
    syntax: 'cases <user>',
    requiredPermissions: {
        user: COMMAND_PERMS.cases.user,
        client: [],
    },
    async run({ message, args, client }) {
        const userInput = args[0];
        if (!userInput) return;

        const userIDInput = stripToID(userInput);

        const Cases = await CaseModel.find({
            guild_id: message.guild.id,
            user_id: userIDInput,
            deleted: false,
        }, null, {
            sort: { createdAt: -1 } // Sort by latest first
        });

        if (Cases.length === 0) throw new Err(404).otherErr().setMessage('No cases found for that user.');

        // Catching this and ignoring it because the user might have deleted their account
        // In which case we are not showing all their user data, just their ID in the embed below
        const user = await client.users.fetch(userIDInput).catch(() => null);

        let currentPageNum = 1;
        const pageNum = findTotalPageNumber(Cases.length, 9);

        // Sending the first page of the user's cases
        const e = new Embed()
            .setAuthor(`Cases of ${user?.tag || userIDInput} - ${Cases.length} total`, user && user.displayAvatarURL({ size: 64, dynamic: true }))
            .setFields(createFields(1, 9, Cases))
            .setFooter(`Page: ${currentPageNum}/${pageNum}`);

        const sentMsg = await message.channel.send({ embeds: [e] });
        await sentMsg.react('◀');
        await sentMsg.react('▶');

        const filter = (reaction, user) => (reaction.emoji.name === '◀' || reaction.emoji.name === '▶') && user.id === message.author.id;
        const collector = sentMsg.createReactionCollector({ filter, time: 60_000 });

        collector.on('end', () => sentMsg.reactions.removeAll());
        collector.on('collect', async (r) => {
            // Remove every reaction from the user so they can press it again
            await r.users.remove(message.author.id).catch(() => { });

            // If the user wants to go back
            if (r._emoji.name === '◀') {
                if (currentPageNum === 1) return; // and if they are at the first page return

                currentPageNum -= 1; // increment the page number down
                e.fields = []; // reset embed fields

                sentMsg.edit({
                    embeds: [
                        e.setFields(
                            createFields(currentPageNum * 9 - 8, currentPageNum * 9, Cases) // Fancy math for 9 elements per page
                        ).setFooter(`Page: ${currentPageNum}/${pageNum}`),
                    ]
                });
            }
            // If the user wants to go forward
            else if (r._emoji.name === '▶') {
                if (currentPageNum === pageNum) return; // and if they are at the last page return

                currentPageNum += 1; // increment the page number up
                e.fields = []; // reset embed fields

                sentMsg.edit({
                    embeds: [
                        e.setFields(
                            createFields(currentPageNum * 9 - 8, currentPageNum * 9, Cases) // Fancy math for 9 elements per page
                        ).setFooter(`Page: ${currentPageNum}/${pageNum}`),
                    ]
                });
            }
        });
    },
};

const createFields = (min, max, data) => {
    let fields = [];
    for (let i = min - 1; i < max; i++) {
        if (data[i] === undefined) continue;

        fields.push({
            name: `Case #${data[i].case} | ${data[i].case_type}`,
            value: `**Moderator:** <@${data[i].moderator}>\n**Date:** ${new DateFormatter(data[i].createdAt).formatToReadable()}\n**Reason:** ${data[i].reason.slice(0, 200)}`,
            inline: true,
        });
    }
    return fields;
};
