'use strict';

const { SlashCommandBuilder } = require('@discordjs/builders');
const DESCRIPTIONS = require('./descriptions.json');
const Embed = require('../../classes/Embed');
const axios = require('axios');

module.exports = {
    name: 'Reactions',
    description: 'Anime GIFs as reactions',
    aliases: [],
    syntax: 'reaction [@mention]',
    requiredPermissions: {
        user: [],
        client: []
    },
    data: new SlashCommandBuilder().setName('reactions').setDescription('Anime GIFs as reactions'),
    async selfPopulate() { // Function to populate the `this.aliases` field
        if (!process.env.OTAKUGIFS_API_KEY) return console.log('Optional OtakuGIFs reactions not configured. This is not an error.');

        try {
            // Get all reactions from otakugifs.xyz
            const response = await axios.get('https://api.otakugifs.xyz/gif/allreactions', {
                headers: {
                    'x-api-key': process.env.OTAKUGIFS_API_KEY
                }
            });

            // Adding all reactions that were returned but only if they exist in the descriptions.json
            this.aliases = response.data.reactions.filter(r => DESCRIPTIONS[r]);

            // Showing which reactions have not been implemented yet in the descriptions.json
            if (this.aliases.length !== response.data.reactions.length)
                console.log(`Your descriptions.json is missing the ${response.data.reactions.filter(r => !DESCRIPTIONS[r]).join(', ')} reaction(s)`);

        } catch (error) {
            console.log('Invalid OtakuGIFs API KEY');
            process.exit(1);
        }

        console.log('Populated reactions');
    },
    async run({ message, cmd }) {

        // Requesting a random GIF from otakugifs.xyz
        const response = await axios.get(`https://api.otakugifs.xyz/gif/${cmd}`, {
            headers: {
                'x-api-key': process.env.OTAKUGIFS_API_KEY
            }
        });

        const highestRoleColor = message.member.roles.color?.hexColor || 0xffffff;

        let desc = DESCRIPTIONS[cmd]; // Object { single: [...], multiple: [...] }
        desc = message.mentions.members.size === 0 ? desc.single : desc.multiple; // Array of `single` or `multiple` [...]
        desc = desc[Math.floor(Math.random() * desc.length)]; // String, random choice from `single` or `multiple`

        // Replacing placeholders with the appropriate values
        desc = desc.replace(/--author/g, message.member.displayName);
        if (message.mentions.members.size !== 0)
            desc = desc.replace(/--target/g, Array.from(message.mentions.members.values()).map(m => m.displayName).join(', '));

        const embed = new Embed()
            .addDescription(desc)
            .setImage(response.data.url)
            .setColor(highestRoleColor)
            .setFooter('Powered by otakugifs.xyz', 'https://otakugifs.b-cdn.net/assets/otakugifsLogo.png');

        message.channel.send({ embeds: [embed] });
    }
};
