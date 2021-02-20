const Discord = require('discord.js');
const readFiles = require('readdirp');
require('dotenv').config();

class Bot extends Discord.Client {
    constructor(config) {
        super(config);
        this.commands = new Discord.Collection();
        this.globalPrefix = '.';
    };

    async loadCommands() {
        for await (const file of readFiles('./commands')) {
            const command = require(file.fullPath);
            this.commands.set(command.name, command);
        };
        return this;
    };

    async loadEvents() {
        for await (const file of readFiles('./events')) {
            const event = require(file.fullPath);
            const eventName = file.path.split('.')[0];
    
            this.on(eventName, event.bind(null, this));
        };
        return this;
    };

    async start() {
        await this.loadCommands();
        await this.loadEvents();
        await this.login(process.env.DISCORD_BOT_TOKEN);
    };
};

const Kiyo = new Bot({
    presence: {
        activity: {
            name: 'IN LESSON | BEING DEVED',
            type: 'COMPETING',
        },
    },
});

Kiyo.start();