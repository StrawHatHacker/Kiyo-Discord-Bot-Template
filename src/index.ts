import { config } from 'dotenv';
config();

import './polyfills';

// const Bot = require('./classes/Bot');
// const { GatewayIntentBits, Options, Partials } = require('discord.js');

// // Creating a new Bot Client instance
// const Kiyo = new Bot({
//     presence: {
//         activity: {
//             name: 'BEING DEVED',
//             type: 'COMPETING',
//         },
//     },
//     makeCache: Options.cacheWithLimits({
//         MessageManager: 100
//     }),
//     allowedMentions: { parse: ['roles', 'users'] },
//     intents: [
//         GatewayIntentBits.Guilds,
//         GatewayIntentBits.GuildInvites,
//         GatewayIntentBits.GuildMembers,
//         GatewayIntentBits.GuildMessages,
//         GatewayIntentBits.MessageContent,
//         GatewayIntentBits.GuildModeration,
//         GatewayIntentBits.GuildMessageReactions,
//         GatewayIntentBits.GuildEmojisAndStickers,
//     ],
//     partials: [
//         Partials.GuildMember,
//         Partials.User,
//         Partials.Message,
//         Partials.Channel,
//         Partials.Reaction
//     ],
//     restRequestTimeout: 5000,
//     restGlobalRateLimit: 40,
//     large_threshold: 100
// });

// Kiyo.start(); // Running the bot
