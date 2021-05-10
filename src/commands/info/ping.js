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
        const botMessage = await message.channel.send('Pinging...');
        
        // The times for the embed - too lazy to use inline
        const days = Math.floor(client.uptime / 86400000);
        const hours = Math.floor(client.uptime / 3600000) % 24;
        const minutes = Math.floor(client.uptime / 60000) % 60;
        const ping = Date.now() - message.createdTimestamp;
        
        // Lets construct the embed!
        // Im using the Embed class to make the embed - thanks to the creator.
        const pingembed = new Embed()
            .setTitle('Pong!')
            .addField('Ping', ':hourglass_flowing_sand: `' + (botMessage.createdTimestamp - message.createdTimestamp) + 'ms`', true)
            .addField('Uptime', ':clock1: `' + days + 'd, ' + hours + 'h`', true)
            .addField('Memory Usage', ':dna: `' + Math.trunc(process.memoryUsage().heapUsed / 1024 / 1024) + 'mb`', true)
           
        // Sending the embed
        botMessage.edit({ embed: pingembed });
    }
};
