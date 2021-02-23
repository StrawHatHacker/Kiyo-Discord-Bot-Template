'use strict';

const { Client, Collection } = require('discord.js');
const readFiles = require('readdirp');
const mongoose = require('mongoose');

/*
    Extending Client with our own methods
*/
module.exports = class Bot extends Client {
    constructor(botConfig) {
        super(botConfig);
        // TODO use Map instead of collection if there is no need for it's helper methods.
        this.commands = new Collection(); // Collection extends map and has cool helper methods.
        this.globalPrefix = '.';
    }

    // PRIVATE
    async _loadCommands() {
        // readdirp flattens the `commands` folder and subfolders after reading all folder recursively.
        for await (const file of readFiles('./commands')) {
            const command = require(file.fullPath);
            this.commands.set(command.name, command);
        }
        return this;
    }

    // PRIVATE
    async _loadEvents() {
        // readdirp flattens the `events` folder and subfolders after reading all folder recursively.
        // this could be done with fs but I'm using  for .
        for await (const file of readFiles('./events')) {
            const event = require(file.fullPath);
            const eventName = file.path.split('.')[0];

            // Adding the event on the client object.
            // Note that filenames should be the name of the fired event (https://discord.js.org/#/docs/main/stable/class/Client) + .js at the end.
            this.on(eventName, event.bind(null, this)); 
        }
        return this;
    }

    // PRIVATE
    async _connectToDB() {
        await mongoose.connect(process.env.DB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to DB');
    }

    // PRIVATE should only be invoked once.
    // TODO check if bot is not running before executing this function, else return.
    async start() {
        await this._loadCommands();
        await this._loadEvents();
        await this._connectToDB();
        await this.login(process.env.DISCORD_BOT_TOKEN);
    }
};