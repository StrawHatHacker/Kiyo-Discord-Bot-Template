const Embed = require('../../classes/Embed');

module.exports = {
    name: 'ping',
    description: 'Pings the bot',
    async run({ message, Kiyo }) {
        try {
            const botMessage = await message.channel.send('Pinging...');

            const embed = new Embed()
                .setAuthor('Kiyo Bot', Kiyo.user.displayAvatarURL({ size: 64 }))
                .addField('Ping', botMessage.createdTimestamp - message.createdTimestamp + ' ms')
                .addField('Serving', `${Kiyo.guilds.cache.size} servers`)
                .setFooter('Made by Skillers3', Kiyo.user.displayAvatarURL({ size: 64 }));

            botMessage.edit('', embed);

        } catch (error) {
            console.log(error)
            message.channel.send('There was an error').catch(() => { });
        };
    }
}