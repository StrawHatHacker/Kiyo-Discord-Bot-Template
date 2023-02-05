'use strict';

module.exports = (withPermissions) => {
    return withPermissions.permissions.has('ManageMessages') ??
        withPermissions.permissions.has('ManageChannels') ??
        withPermissions.permissions.has('Administrator') ??
        withPermissions.permissions.has('KickMembers') ??
        withPermissions.permissions.has('ManageGuild') ??
        withPermissions.permissions.has('BanMembers') ??
        withPermissions.permissions.has('ManageNicknames') ?? false;
};
