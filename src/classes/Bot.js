'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');
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
        this.slashCommands = [];
        this.modulesWithCommands = {};
        this.modulesWithSlashCommands = {};
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

    async _loadSlashCommands() {
        console.log('⌛ Loading slash commands...');
        for await (const file of readFiles('./slashCommands', { fileFilter: ['*.js'], lstat: true })) {
            const command = require(file.fullPath);
            if (command.name === 'reactions') continue;

            // Some commands require property population
            // Reactions for example
            if (command.selfPopulate) await command.selfPopulate();

            // Windows & linux compatibility hack
            if (file.path.includes('\\')) command.module = file.path.split('\\')[0];
            else command.module = file.path.split('/')[0];

            this.slashCommands.push(command);
        }
        console.log('✅ Loaded slash commands');
    }

    // PRIVATE
    async _loadReactions() {
        console.log('⌛ Loading reactions');

        const ReactionsCMD = require('../slashCommands/Reactions/reactions');
        await ReactionsCMD.selfPopulate();

        for (const r of ReactionsCMD.aliases) {
            this.slashCommands.push({
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
    // Loads all slash commands from the `src/slashCommands/` directory and subdirectories.
    async _registerSlashCommands(token) {
        const rest = new REST({ version: '9' }).setToken(token);
        try {
            console.log('⏳ Registering slash commands...');

            const slashCommandsData = this.slashCommands.map(c => c.data.toJSON());
            if (process.env.ENVIRONMENT === 'DEV') {
                await rest.put(
                    Routes.applicationGuildCommands(process.env.BOT_ID, process.env.DEV_GUILD_ID),
                    { body: slashCommandsData });

            } else if (process.env.ENVIRONMENT === 'PRODUCTION') {
                await rest.put(
                    Routes.applicationCommands(process.env.BOT_ID),
                    { body: slashCommandsData });

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
            if (key.includes('src\\slashCommands\\')) delete require.cache[key];
            if (key.includes('src\\utils\\')) delete require.cache[key];
        });
        this.commands = [];
        this.modulesWithCommands = {};
        this.slashCommands = [];
        this.modulesWithSlashCommands = {};
        await this._loadCommands();
        await this._loadSlashCommands();
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
        for (let cmd of this.slashCommands) {
            const moduleName = cmd.module.toLowerCase();
            if (!this.modulesWithSlashCommands[moduleName]) this.modulesWithSlashCommands[moduleName] = [];

            this.modulesWithSlashCommands[moduleName].push(cmd);
        }
    }

    // Starts the bot
    async start() {
        await this._loadCommands();
        await this._loadSlashCommands();
        await this._loadReactions();
        await this._registerSlashCommands(process.env.DISCORD_BOT_TOKEN);
        await this._createModulesWithCommandsField();
        await this._loadEvents();

        this._connectToDB();
        this._registerStreams();

        await this.login(process.env.DISCORD_BOT_TOKEN);
    }
};
