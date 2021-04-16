'use strict';

const Perms = require('../../classes/Permissions');
const Embed = require('../../classes/Embed');

module.exports = {
    name: 'Help',
    description: 'Show all commands and information about the bot, or information about an individual command.',
    aliases: ['help'],
    syntax: 'help [command name]',
    requiredPermissions: {
        user: [],
        client: []
    },
    async run({ client, message, args, Guild }) {
        if (args.length === 0) {

            let fields = {};

            for (let cmd of client.commands) {
                if (!fields[cmd.module]) fields[cmd.module] = [];
                fields[cmd.module].push(cmd);
            }

            const embed = new Embed()
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .addDescription('[ɪɴᴠɪᴛᴇ ᴍᴇ](https://discord.com/api/oauth2/authorize?client_id=794989015765483571&permissions=0&scope=bot) ┃ [ꜱᴜᴘᴘᴏʀᴛ ꜱᴇʀᴠᴇʀ](https://discord.gg/ypEBGHB) \n')
                .addDescription(`Hey! I'm ${client.user.username} and I'm Open Source. You can find me [here](https://github.com/StrawHatHacker/Kiyo-Discord-Bot).\n\u200B`);

            for (const key of Object.keys(fields)) {
                if (key === 'Reactions') {
                    embed.addField(key, fields[key][0].aliases.map(a => `\`${a}\``).join(' '));
                } else {
                    embed.addField(key, fields[key].map(f => `\`${f.name}\``).join(' '));
                }
            }

            embed.addField('\u200B', '\u200B');
            embed.addField('Referrals', 'Hosting Services: [DigitalOcean](https://m.do.co/c/f51cd516e684), [Hetzner](https://hetzner.cloud/?ref=0fswF9Kv99Av)\n\
CDN: [BunnyCDN](https://bunnycdn.com/?ref=1dqicv581x)\n\
VPN: [Surfshark](https://surfshark.club/friend/VZJP3rPr)');
            embed.addField('Donate', '[Ko-fi](https://ko-fi.com/skillers3)');

            message.channel.send(embed);

        } else {
            const arg = args[0].toLowerCase();

            // TODO optimize this / make it look cleaner
            for (let cmd of client.commands) {
                if (arg === cmd.name || cmd.aliases.includes(arg)) {
                    return message.channel.send(new Embed()
                        .addDescription(cmd.description + '\n\u200B')
                        .addField('Syntax', '`' + Guild.prefix + cmd.syntax + '`')
                        .addField('Aliases', cmd.aliases.map(a => `\`${a}\``).join(', '))
                        .addField('Module', cmd.module)
                        .addField('User Permissions', cmd.requiredPermissions.user.length === 0 ? '`None`' : new Perms(cmd.requiredPermissions.user).formatToReadableCode())
                        .addField('Bot Permissions', cmd.requiredPermissions.client.length === 0 ? '`None`' : new Perms(cmd.requiredPermissions.client).formatToReadableCode())
                    );
                } else if (arg === cmd.module.toLowerCase()) {
                    if (cmd.module === 'Reactions') {
                        return message.channel.send(new Embed()
                            .setTitle('Module: Reactions')
                            .addField('Commands', cmd.aliases.map(a => `\`${a}\``).join(', ')));
                    } else {
                        let fields = {};

                        for (let cmd of client.commands) {
                            if (!fields[cmd.module]) fields[cmd.module] = [];
                            fields[cmd.module].push(cmd);
                        }

                        return message.channel.send(new Embed()
                            .setTitle(`Module: ${cmd.module}`)
                            .addField('Commands', fields[cmd.module].map(c => `\`${c.name}\``).join(', ')));
                    }
                }
            }
        }
    }
};