'use strict';

const hasModeratorPerms = require('../../utils/hasModeratorPerms');
const safeFindMember = require('../../utils/safeFindMember');
const TimeParser = require('../../classes/TimeParser');
const databaseUtils = require('../../utils/database');
const { COMMAND_PERMS } = require('../../config');
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
    async run({ message, args, Guild }) {
        const memberInput = args[0];
        const timeInput = args[1];
        if (!memberInput) return;

        const memberToMute = await safeFindMember(message, memberInput);
        if (!memberToMute) throw new Err().inputErr().memberNotFound();

        if (hasModeratorPerms(memberToMute)) throw new Err(400).inputErr().setMessage('Member has moderation permissions');

        let Time;

        // If there is time input, try to match it to the time regex
        const providedTime = timeInput ? timeInput.match(regex) : null;

        // Reason is the args without the cmd name and excluding the time input if there is one
        const reason = args.length > 1 ? args.slice(providedTime ? 2 : 1).join(' ') : 'No reason provided';

        // Roles to add, removing the roles that the member already has
        const muteRoleArrayToAdd = Guild.mute_roles.filter(mr => !memberToMute.roles.cache.has(mr));

        if (providedTime) {
            Time = new TimeParser(providedTime);

            // These don't need to be executed immediately,
            // so they don't have to delay the message reponses, hence why they are wrapped in a setImmediate
            setImmediate(async () => {
                const UserMute = await MuteModel.create({ mute_expire_at: Time.getDateThen() });
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
            });
        }

        await memberToMute.send(`You have been muted in **${message.guild.name}** for: *${reason}*${providedTime ? `\nTime: ${Time.toReadable()}` : ''}`).catch(() => null);
        await memberToMute.roles.add(muteRoleArrayToAdd, 'Muted ' + reason);

        const e = new Embed().setDescription(`**${memberToMute.user.tag} has been muted**`).isSuccess();
        await message.channel.send({ embeds: [e] });
    }
};
