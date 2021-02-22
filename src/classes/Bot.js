const { Client, Collection } = require('discord.js');
const readFiles = require('readdirp');
const mongoose = require('mongoose');

module.exports = class Bot extends Client {
    constructor(config) {
        super(config);
        this.commands = new Collection();
        this.globalPrefix = '.';
    }

    async _loadCommands() {
        for await (const file of readFiles('./commands')) {
            const command = require(file.fullPath);
            this.commands.set(command.name, command);
        }
        return this;
    }

    async _loadEvents() {
        for await (const file of readFiles('./events')) {
            const event = require(file.fullPath);
            const eventName = file.path.split('.')[0];

            this.on(eventName, event.bind(null, this));
        }
        return this;
    }

    async _connectToDB() {
        await mongoose.connect(process.env.DB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to DB');
    }

    async start() {
        await this._loadCommands();
        await this._loadEvents();
        await this._connectToDB();
        await this.login(process.env.DISCORD_BOT_TOKEN);
    }
};