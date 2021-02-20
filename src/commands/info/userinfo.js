const DateFormatter = require('../../classes/DateFormatter');
const Permissions = require('../../classes/Permissions');
const Embed = require('../../classes/Embed');

module.exports = {
    name: 'userinfo',
    description: 'Shows information about a user',
    async run({ message, args }) {
        // TODO profile command
        const targetMemberID = (args.length < 1) ? message.author.id : args[0].replace(/[^0-9]+/g, '');
        const targetMember = await message.guild.members.fetch(targetMemberID);

        if (targetMember === undefined) return;

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

        const keyPermissions = targetMemberID === message.guild.ownerID ? 'Owner' : new Permissions(targetMember.permissions.toArray()).formatPerms();

        const embed = new Embed()
            .setAuthor(targetMember.displayName, smallAV)
            .setThumbnail(bigAV)
            .addDescription(`Mention: ${targetMember.toString()}`)
            .addDescription(`Joined at: ${joinedAt}`)
            .addDescription(`Created at: ${createdAt}`)
            .addField(`Roles (${targetMember.roles.cache.size - 1})`, `Highest: ${targetMember.roles.highest.toString()} \n\n ${rolesString}`)
            .addField(`All Permissions`, keyPermissions)
            .setFooter(`Requested by: ${message.member.displayName}`, authorAV);

        message.channel.send(embed);
    }
}