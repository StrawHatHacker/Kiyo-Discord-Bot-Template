require('dotenv').config();
const Bot = require('./classes/Bot');

const Kiyo = new Bot({
    presence: {
        activity: {
            name: 'IN LESSON | BEING DEVED',
            type: 'COMPETING',
        },
    },
});

Kiyo.start();