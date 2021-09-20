'use strict';

const { SlashCommandBuilder } = require('@discordjs/builders');
const Perms = require('../../classes/Permissions');
const Embed = require('../../classes/Embed');

module.exports = {
    name: 'help',
    description: 'Show all commands and information about the bot, or information about an individual command or module',
    aliases: [],
    syntax: 'help [command name]',
    requiredPermissions: {
        user: [],
        client: []
    },
    slashCommand: true,
    selfPopulate() {
        this.data = new SlashCommandBuilder().setName('help').setDescription('Show all commands and information about the bot')
            .addStringOption(o => o.setName('command').setDescription('The command to get information about'));
    },
    async run(client, interaction) {
        const arg = interaction.options.getString('command');

        if (!arg) {
            const e = new Embed()
                .setColor(interaction.guild.me.roles.color?.hexColor || 0xffffff)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .addDescription('[ɪɴᴠɪᴛᴇ ᴍᴇ](https://discord.com/api/oauth2/authorize?client_id=794989015765483571&permissions=0&scope=bot) ┃ [ꜱᴜᴘᴘᴏʀᴛ ꜱᴇʀᴠᴇʀ](https://discord.gg/ypEBGHB) \n')
                .addDescription(`Hey! I'm ${client.user.username} and I'm Open Source. You can find me [here](https://github.com/StrawHatHacker/Kiyo-Discord-Bot).\n\u200B`)
                .addDescription('Type `/help moduleName` to see all commands of that module.')
                .addDescription('Type `/help commandName` to see all information of that command.')
                .addField('Prefix Modules', Object.keys(client.modulesWithCommands).map(m => `\`${m}\``).join(', '))
                .addField('Slash Modules', Object.keys(client.modulesWithSlashCommands).map(m => `\`${m}\``).join(', '))
                .addField('Referrals', 'Hosting Services: [DigitalOcean](https://m.do.co/c/f51cd516e684), [Hetzner](https://hetzner.cloud/?ref=0fswF9Kv99Av)\nCDN: [BunnyCDN](https://bunnycdn.com/?ref=1dqicv581x)\nVPN: [Surfshark](https://surfshark.club/friend/VZJP3rPr)')
                .addField('Donate', '[Ko-fi](https://ko-fi.com/skillers3)');

            return await interaction.reply({ embeds: [e] });
        }

        // Search throught modules
        if (Object.keys(client.modulesWithCommands).includes(arg)) {
            const moduleCommands = client.modulesWithCommands[arg].map(c => c.name);
            return await sendModuleHelp(interaction, moduleCommands, arg);
        }

        if (Object.keys(client.modulesWithSlashCommands).includes(arg)) {
            let moduleCommands = [];

            if (arg === 'reactions') moduleCommands = client.modulesWithSlashCommands['reactions'][0].aliases;
            else moduleCommands = client.modulesWithSlashCommands[arg].map(c => c.name);

            return await sendModuleHelp(interaction, moduleCommands, arg);
        }

        // Search throught command names
        const cmd = client.commands.find(c => c.name.toLowerCase() === arg || c.name.aliases.includes(arg));
        if (cmd) return await sendCommandHelp(interaction, cmd);

        const slashCmd = client.slashCommands.find(c => c.name.toLowerCase() === arg);
        if (slashCmd) return await sendCommandHelp(interaction, slashCmd);
    }
};

const sendModuleHelp = async (interaction, moduleCommands, arg) => {
    const e = new Embed()
        .setColor(interaction.guild.me.roles.color?.hexColor || 0xffffff)
        .setTitle(`Module: ${arg}`)
        .addField('Commands', moduleCommands.map(c => `\`${c}\``).join(', '));
    await interaction.reply({ embeds: [e] });
};

const sendCommandHelp = async (interaction, cmd) => {
    const e = new Embed()
        .setColor(interaction.guild.me.roles.color?.hexColor || 0xffffff)
        .setTitle(`Command: ${cmd.name}`)
        .addDescription(`Syntax: \`/${cmd.syntax}\``)
        .addDescription(`Module: ${cmd.module}`);

    if (cmd.aliases?.length > 0) e.addDescription(`Aliases: ${cmd.aliases.map(c => `\`${c}\``).join(', ')}`);

    e.addDescription(`User Permissions: ${cmd.requiredPermissions.user.length === 0 ? '`None`' : new Perms(cmd.requiredPermissions.user).formatToReadableCode()}`)
        .addDescription(`Bot Permissions: ${cmd.requiredPermissions.client.length === 0 ? '`None`' : new Perms(cmd.requiredPermissions.client).formatToReadableCode()}`)
        .addDescription('\n' + cmd.description);
    return await interaction.reply({ embeds: [e] });
};
