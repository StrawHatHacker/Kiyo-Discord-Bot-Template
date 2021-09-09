'use strict';

const Embed = require('../../classes/Embed');

module.exports = {
    name: 'Ping',
    description: 'Pings the bot',
    aliases: ['ping'],
    syntax: 'ping ',
    requiredPermissions: {
        user: [],
        client: []
    },
    async run({ message, client }) {
        // Sending temporary message
        const botMessage = await message.channel.send({ content: 'Pinging...' });

        const { minutes, hours, days } = getTimeFromMS(client.uptime);

        const pingembed = new Embed()
            .addField('Ping', `:hourglass_flowing_sand: ${botMessage.createdTimestamp - message.createdTimestamp}ms`, true)
            .addField('Websocket', `${client.ws.ping}ms`, true)
            .addField('Uptime', `:clock1: ${days}d, ${hours}h, ${minutes}m`, true)
            .addField('Memory Usage', `:dna: ${Math.trunc(process.memoryUsage().heapUsed / 1024 / 1024)}MBs`, true);

        // Editing the embed
        botMessage.edit({ content: '\u2005', embeds: [pingembed] });
    }
};

const getTimeFromMS = (time) => {
    const days = Math.floor(time / 86400000);
    const hours = Math.floor(time / 3600000) % 24;
    const minutes = Math.floor(time / 60000) % 60;

    return { days, hours, minutes };
};
