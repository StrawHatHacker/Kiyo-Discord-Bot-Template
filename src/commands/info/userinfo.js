'use strict';

const DateFormatter = require('../../utils/DateFormatter');
const Permissions = require('../../classes/Permissions');
const Embed = require('../../classes/Embed');
const Err = require('../../classes/Err');

module.exports = {
    name: 'userinfo',
    description: 'Shows information about a user',
    async run({ message, args }) {
        // TODO profile command

        // if args.length < 1 then targetMember is the message author
        // if there is an argument, strip it from all characters except numbers, basically trying to get a 1234567890 from <@1234567890>
        // this specific implementation works only for mentioned users and IDs
        const targetMemberID = (args.length < 1) ? message.author.id : args[0].replace(/[^0-9]+/g, '');

        // Returning if the id is empty, since empty string triggers the .fetch below to return all users in the guild
        if (targetMemberID === '') throw new Err(404).inputErr().memberNotFound();

        // Fetch GuildMember from cache or from the API
        const targetMember = await message.guild.members.fetch(targetMemberID).catch(e => {
            throw new Err(e.httpStatus).inputErr().memberNotFound();
        });

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
        // If member is the guild owner, bypass permissions fitlering and formatting
        const keyPerms = targetMemberID === message.guild.ownerID ? 'Owner' : new Permissions(memberPerms).filterKeyPerms().formatToReadable();
        const otherPerms = targetMemberID === message.guild.ownerID ? 'Owner' : new Permissions(memberPerms).filterNonKeyPerms().formatToReadable();

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