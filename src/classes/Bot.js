'use strict';

const { Client } = require('discord.js');
const readFiles = require('readdirp');
const mongoose = require('mongoose');

/*
    Extending Client with our own methods
*/
module.exports = class Bot extends Client {
    /**
     * @param {*} botConfig https://discord.js.org/#/docs/main/12.5.3/typedef/ClientOptions
     */
    constructor(botConfig) {
        super(botConfig);
        this.commands = [];
        this.modulesWithCommands = {};
    }

    // PRIVATE
    // Loads all commands from the `src/commands/` directory and subdirectories.
    async _loadCommands() {
        // readdirp flattens the `commands` folder and subfolders after reading all folders recursively.
        for await (const file of readFiles('./commands', { fileFilter: ['*.js'], lstat: true })) {
            const command = require(file.fullPath);

            // Deleting cached module from require cache, since it's already cached on the Bot Class instanece.
            delete require.cache[require.resolve(file.fullPath)];

            // Some commands require property population from 3rd party apps
            // Reactions for example
            if (command.selfPopulate) await command.selfPopulate();

            // Windows & linux compatibility hack
            if (file.path.includes('\\')) command.module = file.path.split('\\')[0];
            else command.module = file.path.split('/')[0];

            this.commands.push(command);
        }
        return this;
    }

    async reloadCommands() {
        this.commands = [];
        this.modulesWithCommands = {};
        await this._loadCommands();
        await this._createModulesWithCommandsField();
    }

    // PRIVATE
    // Loads all events from the `src/events/` directory.
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
    // Connects to the database.
    async _connectToDB() {
        await mongoose.connect(process.env.DB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to DB');
    }

    // PRIVATE
    // Always needs to be executed after this._loadCommands
    async _createModulesWithCommandsField() {
        for (let cmd of this.commands) {
            const moduleName = cmd.module.toLowerCase();
            if (!this.modulesWithCommands[moduleName]) this.modulesWithCommands[moduleName] = [];

            this.modulesWithCommands[moduleName].push(cmd);
        }
    }

    // TODO use promise.all
    // Starts the bot
    async start() {
        await this._loadCommands();
        await this._createModulesWithCommandsField();
        await this._loadEvents();
        await this._connectToDB();
        await this.login(process.env.DISCORD_BOT_TOKEN);
    }
};
