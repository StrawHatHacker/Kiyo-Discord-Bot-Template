'use strict';

module.exports = {
    name: 'ping',
    description: 'Pings the bot',
    async run({ message, Kiyo }) {
        // Sending temporary message
        const botMessage = await message.channel.send('Pinging...');
        
        // Calculating ping, it's the time between the user message and our botMessage
        botMessage.edit(`Ping: ${botMessage.createdTimestamp - message.createdTimestamp}ms\nWebSocket: ${Kiyo.ws.ping}ms`);
    }
};