'use strict';

module.exports = (withPermissions) => {
    return withPermissions.permissions.has('MANAGE_MESSAGES') ??
        withPermissions.permissions.has('MANAGE_CHANNELS') ??
        withPermissions.permissions.has('VIEW_AUDIT_LOG') ??
        withPermissions.permissions.has('ADMINISTRATOR') ??
        withPermissions.permissions.has('KICK_MEMBERS') ??
        withPermissions.permissions.has('MANAGE_GUILD') ??
        withPermissions.permissions.has('BAN_MEMBERS') ??
        withPermissions.permissions.has('MANAGE_NICKNAMES') ??
        withPermissions.permissions.has('MANAGE_EMOJIS_AND_STICKERS') ?? false;
};
