'use strict';

const hasModeratorPerms = require('../../utils/hasModeratorPerms');
const safeFindMember = require('../../utils/safeFindMember');
const { COMMAND_PERMS } = require('../../config');
const MuteModel = require('../../models/mute');
const UserModel = require('../../models/user');
const sendLog = require('../../utils/sendLog');
const Embed = require('../../classes/Embed');
const Err = require('../../classes/Err');

module.exports = {
    name: 'unmute',
    description: 'Unmute a member',
    aliases: [],
    syntax: 'unmute <member> [reason]',
    requiredPermissions: {
        user: COMMAND_PERMS.mute.user,
        client: ['MANAGE_ROLES']
    },
    cooldown: 2000,
    async run({ message, args, Guild }) {
        const memberInput = args[0];
        if (!memberInput) return;

        const memberToUnmute = await safeFindMember(message, memberInput);
        if (!memberToUnmute) throw new Err().inputErr().memberNotFound();
        if (hasModeratorPerms(memberToUnmute)) throw new Err(400).inputErr().setMessage('Member has moderation permissions');

        // Reason is the args without the cmd name and excluding the time input if there is one
        const reason = args.length > 1 ? args.slice(1).join(' ') : 'No reason provided';

        const UserToUnmute = await UserModel.findById(memberToUnmute.id);

        // Find all the timed mutes the member has
        // Filter them by the guild id
        // Map the doc IDs (they are (_id)s of the MuteModel) for the query
        const muteDocIDs = UserToUnmute.mutes
            .filter(m => m.guild_id === message.guild.id)
            .map(m => {
                return {
                    _id: m.doc_id
                };
            });

        if (muteDocIDs.length > 0) {
            const Mutes = await MuteModel.find({ $or: muteDocIDs });
            if (Mutes.length > 0) {
                // Delete documents from the MuteModel
                // This is also trigger the userMute stream handler which unmutes the user in the guild
                // Instead of it happening autmatically, we do it manually by deleting the mongo documents
                await MuteModel.deleteMany({ $or: muteDocIDs });
            }
        }

        // But, in case the user has no timed mutes, we still need to remove the mute roles
        await memberToUnmute.roles.remove(Guild.mute_roles, 'Unmuted ' + reason);

        const e = new Embed().setDescription(`**${memberToUnmute.user.tag} has been unmuted**`).isSuccess();
        await message.channel.send({ embeds: [e] });

        await sendLog('unmute', Guild, message.guild, memberToUnmute, message.member, reason);
    }
};
