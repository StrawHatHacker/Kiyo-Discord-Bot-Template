'use strict';

const { Client } = require('discord.js');
const readFiles = require('readdirp');
const mongoose = require('mongoose');

/*
    Extending Client with our own methods
*/
module.exports = class Bot extends Client {
    constructor(botConfig) {
        super(botConfig);
        this.commands = [];
    }

    // PRIVATE
    async _loadCommands() {
        // readdirp flattens the `commands` folder and subfolders after reading all folders recursively.
        for await (const file of readFiles('./commands', { fileFilter: ['*.js'], lstat: true })) {
            const command = require(file.fullPath);

            // Some commands require property population from 3rd party apps
            // Reactions for example
            if (command.selfPopulate) await command.selfPopulate();

            // TODO test on linux
            command.module = file.path.split('\\')[0];

            this.commands.push(command);
        }
        return this;
    }

    // PRIVATE
    async _loadEvents() {
        // readdirp flattens the `events` folder and subfolders after reading all folders recursively.
        // this could be done with fs but I'm using readdirp for consistency.
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

    // TODO use promise.all
    async start() {
        await this._loadCommands();
        await this._loadEvents();
        await this._connectToDB();
        await this.login(process.env.DISCORD_BOT_TOKEN);
    }
};