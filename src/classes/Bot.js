'use strict';

const { SlashCommandBuilder } = require('@discordjs/builders');
const LocalCache = require('../classes/LocalCache');
const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');
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
        this.interactions = [];
        this.modulesWithCommands = {};
        this.modulesWithInteractions = {};
        this.guildCache = new LocalCache(0, 0); // Not expirable
    }

    // PRIVATE
    // Loads all commands from the `src/commands/` directory and subdirectories.
    async _loadCommands() {
        console.log('⌛ Loading commands...');
        // readdirp flattens the `commands` folder and subfolders after reading all folders recursively.
        for await (const file of readFiles('./commands', { fileFilter: ['*.js'], lstat: true })) {
            const command = require(file.fullPath);

            // Some commands require property population
            if (command.selfPopulate) await command.selfPopulate();

            // Windows & linux compatibility hack
            if (file.path.includes('\\')) command.module = file.path.split('\\')[0];
            else command.module = file.path.split('/')[0];

            this.commands.push(command);
        }
        console.log('✅ Loaded commands');
    }

    async _loadInteractions() {
        console.log('⌛ Loading slash commands...');
        for await (const file of readFiles('./interactions', { fileFilter: ['*.js'], lstat: true })) {
            const command = require(file.fullPath);
            if (command.name === 'reactions') continue;

            // Some commands require property population
            // Reactions for example
            if (command.selfPopulate) await command.selfPopulate();

            // Windows & linux compatibility hack
            if (file.path.includes('\\')) command.module = file.path.split('\\')[0];
            else command.module = file.path.split('/')[0];

            this.interactions.push(command);
        }
        console.log('✅ Loaded slash commands');
    }

    // PRIVATE
    async _loadReactions() {
        console.log('⌛ Loading reactions');

        const ReactionsCMD = require('../interactions/Reactions/reactions');
        await ReactionsCMD.selfPopulate();

        for (const r of ReactionsCMD.aliases) {
            this.interactions.push({
                name: r,
                description: 'Anime GIFs as reactions',
                aliases: [],
                syntax: `${r} [@mention]`,
                requiredPermissions: {
                    user: [],
                    client: []
                },
                cooldown: 5000,
                module: 'reactions',
                run: ReactionsCMD.run,
                data: new SlashCommandBuilder().setName(r).setDescription('Anime GIFs as reactions')
                    .addUserOption(o => o.setName('user').setDescription('User to react to').setRequired(false))
            });
        }

        console.log('✅ Loaded reactions');
    }

    // PRIVATE
    // Loads all slash commands from the `src/interactions/` directory and subdirectories.
    async _registerInteractions(token) {
        const rest = new REST({ version: '10' }).setToken(token);
        try {
            console.log('⏳ Registering slash commands...');

            const interactionsData = this.interactions.map(c => c.data.toJSON());
            if (process.env.ENVIRONMENT === 'DEV') {
                await rest.put(
                    Routes.applicationGuildCommands(process.env.BOT_ID, process.env.DEV_GUILD_ID),
                    { body: interactionsData });

            } else if (process.env.ENVIRONMENT === 'PRODUCTION') {
                await rest.put(
                    Routes.applicationCommands(process.env.BOT_ID),
                    { body: interactionsData });

            } else {
                throw new Error('Environment variable "ENVIRONMENT" is neither "DEV" or "PRODUCTION"');
            }

            console.log('✅ Registered slash commands');
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }

    // PUBLIC
    // Reloading commands and updating file cache. Mongoose Models and Classes should not be overriden
    async reloadCommands() {
        Object.keys(require.cache).forEach((key) => {
            if (key.includes('src\\commands\\')) delete require.cache[key];
            if (key.includes('src\\interactions\\')) delete require.cache[key];
            if (key.includes('src\\utils\\')) delete require.cache[key];
        });
        this.commands = [];
        this.modulesWithCommands = {};
        this.interactions = [];
        this.modulesWithInteractions = {};
        await this._loadCommands();
        await this._loadInteractions();
        await this._createModulesWithCommandsField();
        console.log('Reloaded commands');
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
    _connectToDB() {
        mongoose.connect(process.env.DB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('🍃 Connected to DB');
    }

    // PRIVATE
    _registerStreams() {
        const MuteModel = require('../models/mute');
        const userMuteHandler = require('../streamHandlers/userMute');

        // USED FOR UNMUTES
        const userMuteStream = MuteModel.watch([{ $match: { operationType: 'delete' } }]);
        userMuteStream.on('change', document => userMuteHandler(this, document));
    }

    // PRIVATE
    // Always needs to be executed after this._loadCommands
    async _createModulesWithCommandsField() {
        for (let cmd of this.commands) {
            const moduleName = cmd.module.toLowerCase();
            if (!this.modulesWithCommands[moduleName]) this.modulesWithCommands[moduleName] = [];

            this.modulesWithCommands[moduleName].push(cmd);
        }
        for (let cmd of this.interactions) {
            const moduleName = cmd.module.toLowerCase();
            if (!this.modulesWithInteractions[moduleName]) this.modulesWithInteractions[moduleName] = [];

            this.modulesWithInteractions[moduleName].push(cmd);
        }
    }

    // Starts the bot
    async start() {
        await this._loadCommands();
        await this._loadInteractions();
        await this._loadReactions();
        await this._registerInteractions(process.env.DISCORD_BOT_TOKEN);
        await this._createModulesWithCommandsField();
        await this._loadEvents();

        this._connectToDB();
        this._registerStreams();

        return this.login(process.env.DISCORD_BOT_TOKEN).catch(() => {
            console.error('Invalid Discord token.');
            process.exit(1);
        });
    }
};
