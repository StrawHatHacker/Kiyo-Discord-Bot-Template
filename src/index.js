'use strict';

require('dotenv').config();
const Bot = require('./classes/Bot');

// Creating a new Bot Client instance
const Kiyo = new Bot({
    presence: {
        activity: {
            name: 'IN LESSON | BEING DEVED',
            type: 'COMPETING',
        },
    },
});

Kiyo.start(); // Running the bot
