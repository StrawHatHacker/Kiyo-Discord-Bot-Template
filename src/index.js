'use strict';

require('dotenv').config();
require('./polyfills');

const Bot = require('./classes/Bot');
const { GatewayIntentBits, Options } = require('discord.js');

// Creating a new Bot Client instance
const Kiyo = new Bot({
    presence: {
        activity: {
            name: 'BEING DEVED',
            type: 'COMPETING',
        },
    },
    makeCache: Options.cacheWithLimits({
        MessageManager: 100
    }),
    allowedMentions: { parse: ['roles', 'users'] },
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildEmojisAndStickers,
    ],
    partials: ['GUILD_MEMBER', 'USER', 'MESSAGE', 'CHANNEL', 'REACTION'],
    restRequestTimeout: 5000,
    restGlobalRateLimit: 40,
    large_threshold: 100
});

Kiyo.start(); // Running the bot
