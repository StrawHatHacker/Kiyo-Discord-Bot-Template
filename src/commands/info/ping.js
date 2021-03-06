'use strict';

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
        
        // Calculating ping, it's the time between the user message and our botMessage
        botMessage.edit(`Ping: ${botMessage.createdTimestamp - message.createdTimestamp}ms\nWebSocket: ${client.ws.ping}ms`);
    }
};