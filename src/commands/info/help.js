'use strict';

const Perms = require('../../classes/Permissions');
const Embed = require('../../classes/Embed');

module.exports = {
    name: 'Help',
    description: 'Show all commands and information about the bot, or information about an individual command or module.',
    aliases: ['help'],
    syntax: 'help [command name]',
    requiredPermissions: {
        user: [],
        client: []
    },
    async run({ client, message, args, Guild }) {
        // If no argument is passed (EG. .help)
        if (args.length === 0) {
            return message.channel.send(new Embed()
                .setColor(message.guild.me.roles.color?.hexColor || 0xffffff)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .addDescription('[ɪɴᴠɪᴛᴇ ᴍᴇ](https://discord.com/api/oauth2/authorize?client_id=794989015765483571&permissions=0&scope=bot) ┃ [ꜱᴜᴘᴘᴏʀᴛ ꜱᴇʀᴠᴇʀ](https://discord.gg/ypEBGHB) \n')
                .addDescription(`Hey! I'm ${client.user.username} and I'm Open Source. You can find me [here](https://github.com/StrawHatHacker/Kiyo-Discord-Bot).\n\u200B`)
                .addDescription(`Type \`${Guild.prefix}help moduleName\` to see all commands of that module.`)
                .addDescription(`Type \`${Guild.prefix}help commandName\` to see all information of that command.`)
                .addField('Modules', Object.keys(client.modulesWithCommands).map(m => `\`${m}\``).join(', '))
                .addField('Referrals', 'Hosting Services: [DigitalOcean](https://m.do.co/c/f51cd516e684), [Hetzner](https://hetzner.cloud/?ref=0fswF9Kv99Av)\nCDN: [BunnyCDN](https://bunnycdn.com/?ref=1dqicv581x)\nVPN: [Surfshark](https://surfshark.club/friend/VZJP3rPr)')
                .addField('Donate', '[Ko-fi](https://ko-fi.com/skillers3)'));
        }
        // Else, meaning there is an argument
        else {
            const arg = args[0].toLowerCase();

            // Search throught modules
            if (Object.keys(client.modulesWithCommands).includes(arg)) {
                let moduleCommands;

                if (arg === 'reactions') moduleCommands = client.modulesWithCommands['reactions'][0].aliases;
                else moduleCommands = client.modulesWithCommands[arg].map(c => c.name);

                return message.channel.send(new Embed()
                    .setColor(message.guild.me.roles.color?.hexColor || 0xffffff)
                    .setTitle(`Module: ${arg}`)
                    .addField('Commands', moduleCommands.map(c => `\`${c}\``).join(', '))
                );

            }
            // Search throught command names and aliases
            else {
                for (let cmd of client.commands) {
                    if (arg === cmd.name || cmd.aliases.includes(arg)) {
                        return message.channel.send(new Embed()
                            .setColor(message.guild.me.roles.color?.hexColor || 0xffffff)
                            .setTitle(`Command: ${cmd.name}`)
                            .addDescription(`Syntax: \`${Guild.prefix}${cmd.syntax}\``)
                            .addDescription(`Aliases: ${cmd.aliases.map(a => `\`${a}\``).join(', ')}`)
                            .addDescription(`Module: ${cmd.module}`)
                            .addDescription(`User Permissions: ${cmd.requiredPermissions.user.length === 0 ? '`None`' : new Perms(cmd.requiredPermissions.user).formatToReadableCode()}`)
                            .addDescription(`Bot Permissions: ${cmd.requiredPermissions.client.length === 0 ? '`None`' : new Perms(cmd.requiredPermissions.client).formatToReadableCode()}`)
                            .addDescription('\n' + cmd.description)
                        );
                    }
                }
            }
        }
    }
};
