'use strict';

const { SlashCommandBuilder } = require('@discordjs/builders');
const Embed = require('../../classes/Embed');
const si = require('systeminformation');

module.exports = {
    name: 'ping',
    description: 'Pings the bot',
    syntax: 'ping',
    aliases: [],
    requiredPermissions: {
        user: [],
        client: []
    },
    slashCommand: true,
    cooldown: 5000,
    selfPopulate() {
        this.data = new SlashCommandBuilder().setName(this.name).setDescription(this.description);
    },
    async run(client, interaction) {
        await interaction.reply({ content: 'Pinging...', username: 'test' });
        const reply = await interaction.fetchReply();

        const { minutes, hours, days } = getTimeFromMS(client.uptime);

        const pingembed = new Embed()
            .addField('Ping', `:hourglass_flowing_sand: ${reply.createdTimestamp - interaction.createdTimestamp}ms`, true)
            .addField('Websocket', `${client.ws.ping}ms`, true)
            .addField('Uptime', `:clock1: ${days}d, ${hours}h, ${minutes}m`, true)
            .addField('Memory Usage', `:dna: ${Math.trunc(process.memoryUsage().heapUsed / 1024 / 1024)}MBs`, true);


        await interaction.editReply({ content: '\u2005', embeds: [pingembed] });

        const cpu = await si.cpu();
        pingembed.addField('CPU Usage', `${cpu.manufacturer} - ${cpu.cores} Cores - ${cpu.speed}GHz`, true);

        await interaction.editReply({ content: '\u2005', embeds: [pingembed] });
    }
};

const getTimeFromMS = (time) => {
    const days = Math.floor(time / 86400000);
    const hours = Math.floor(time / 3600000) % 24;
    const minutes = Math.floor(time / 60000) % 60;

    return { days, hours, minutes };
};
