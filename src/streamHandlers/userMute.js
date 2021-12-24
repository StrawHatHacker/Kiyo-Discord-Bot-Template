'use strict';

const GuildModel = require('../models/guild');
const UserModel = require('../models/user');

module.exports = async (client, doc) => {
    try {
        const User = await UserModel.findOne({ 'mutes.doc_id': doc.documentKey._id });
        if (!User) return;

        const muteEntry = User.mutes.find(m => m.doc_id == doc.documentKey._id);

        await User.updateOne({
            $pull: {
                mutes: muteEntry
            }
        });

        const Guild = await GuildModel.findById(muteEntry.guild_id);
        const guild = client.guilds.cache.get(Guild._id);
        if (!guild.available) return;

        const memberToUnmute = await guild.members.fetch(User._id);
        if (!memberToUnmute) return;

        await memberToUnmute.roles.remove(muteEntry.roles_muted_with);

    } catch (error) {
        console.log(error);
    }
};
