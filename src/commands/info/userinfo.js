'use strict';

const DateFormatter = require('../../utils/DateFormatter');
const Permissions = require('../../classes/Permissions');
const findMember = require('../../utils/findMember');
const { COMMAND_PERMS } = require('../../config');
const Embed = require('../../classes/Embed');
const Err = require('../../classes/Err');

module.exports = {
    name: 'Userinfo',
    description: 'Shows information about a user',
    aliases: ['userinfo', 'ui'],
    syntax: 'userinfo [@mention]',
    requiredPermissions: {
        user: COMMAND_PERMS.userinfo.user,
        client: []
    },
    async run({ message, args }) {
        // TODO profile command
        let targetMember;

        // if args.length < 1 then targetMember is the message author
        if (args.length < 1) targetMember = message.member;
        else targetMember = await findMember(message, args[0]);

        if (targetMember === undefined) throw new Err(404).inputErr().memberNotFound();

        // Remove the '@everyone' role from the member and format their roles into a string
        const rolesString = targetMember.roles.cache
            .filter(role => role.name !== '@everyone')
            .map(role => role.toString())
            .join('')
            .slice(0, 1900);

        const authorAV = message.author.displayAvatarURL({ size: 256, dynamic: true });
        const smallAV = targetMember.user.displayAvatarURL({ size: 256, dynamic: true });
        const bigAV = targetMember.user.displayAvatarURL({ size: 4096, dynamic: true });

        const joinedAt = new DateFormatter(new Date(targetMember.joinedTimestamp)).formatToReadable();
        const createdAt = new DateFormatter(new Date(targetMember.user.createdTimestamp)).formatToReadable();

        const memberPerms = targetMember.permissions.toArray();
        // If member is the guild owner, bypass permission filtering and formatting
        const keyPerms = targetMember.id === message.guild.ownerID ? 'Owner' : new Permissions(memberPerms).filterKeyPerms().formatToReadable();
        const otherPerms = targetMember.id === message.guild.ownerID ? 'Owner' : new Permissions(memberPerms).filterNonKeyPerms().formatToReadable();
        
        const embed = new Embed()
            .setAuthor(targetMember.displayName, smallAV)
            .setThumbnail(bigAV)
            .addDescription(`Mention: ${targetMember.toString()}`)
            .addDescription(`Joined at: ${joinedAt}`)
            .addDescription(`Created at: ${createdAt}`)
            .addField(`Roles (${targetMember.roles.cache.size - 1})`, `Highest: ${targetMember.roles.highest.toString()} \n\n ${rolesString}`)
            .addField('Key Permissions', keyPerms)
            .addField('Other Permissions', otherPerms)
            .setFooter(`Requested by: ${message.member.displayName}`, authorAV);

        await message.channel.send(embed);
    }
};
