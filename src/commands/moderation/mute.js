'use strict';

const hasModeratorPerms = require('../../utils/hasModeratorPerms');
const safeFindMember = require('../../utils/safeFindMember');
const TimeParser = require('../../classes/TimeParser');
const databaseUtils = require('../../utils/database');
const createCase = require('../../utils/createCase');
const { COMMAND_PERMS } = require('../../config');
const parseDuration = require('parse-duration');
const sendLog = require('../../utils/sendLog');
const MuteModel = require('../../models/mute');
const Embed = require('../../classes/Embed');
const Err = require('../../classes/Err');

const regex = /(\d+)(D|H|M)/gi;

module.exports = {
    name: 'mute',
    description: 'Mute a member for a specific time',
    aliases: [],
    syntax: 'mute <member> [time] [reason]',
    requiredPermissions: {
        user: COMMAND_PERMS.mute.user,
        client: ['MANAGE_ROLES']
    },
    cooldown: 2000,
    async run({ message, args, Guild }) {
        const memberInput = args[0];
        if (!memberInput) return;

        const memberToMute = await safeFindMember(message, memberInput);
        if (!memberToMute) throw new Err().inputErr().memberNotFound();

        if (hasModeratorPerms(memberToMute)) throw new Err(400).inputErr().setMessage('Member has moderation permissions');

        const reason = args.length > 1 ? args.slice(1).join(' ') : 'No reason provided';

        // Roles to add, removing the roles that the member already has
        const muteRoleArrayToAdd = Guild.mute_roles.filter(mr => !memberToMute.roles.cache.has(mr));

        await memberToMute.send(`You have been muted in **${message.guild.name}** for: *${reason}*`).catch(() => null);
        await memberToMute.roles.add(muteRoleArrayToAdd, 'Muted ' + reason);

        const e = new Embed().setDescription(`**${memberToMute.user.tag} has been muted**`).isSuccess();
        await message.channel.send({ embeds: [e] });

        const NewCase = await createCase(message.guild.id, memberToMute.id, message.author.id, reason, 'mute');
        await sendLog('mute', Guild, message.guild, [memberToMute, NewCase], message.member, reason);

        // Format message content to find possible time values
        const strToParse = args.slice(1)     // Slice user's id
            .filter(a => a.match(regex))     // Filter elements that don't match the time regex
            .map(a => a.replaceAll('-', '')) // Replace hyphens with empty string, to avoid negative values
            .join(' ');

        // Parse the formatted time into ms
        const timeToMuteMS = parseDuration(strToParse, 'ms');

        // Get the date that the user will be unmuted
        let timeThen;
        timeToMuteMS !== null ? timeThen = new TimeParser(timeToMuteMS).getTimeThen() : timeThen = null;

        // If there is a time, add the mute to the database
        if (timeThen) {
            const UserMute = await MuteModel.create({ mute_expire_at: timeThen });
            const UserToMute = await databaseUtils.user.findOneOrCreate(memberToMute.id);
            await UserToMute.updateOne({
                $push: {
                    mutes: {
                        doc_id: UserMute._id,
                        guild_id: message.guild.id,
                        roles_muted_with: Guild.mute_roles
                    }
                }
            });
        }
    }
};
