'use strict';

const Permissions = require('../classes/Permissions');

module.exports = (Kiyo, message, cmdName, requiredPermissions) => {
    try {
        const userhasPermission = new Permissions(message.member.permissions)
            .filterKeyPerms()
            .userhasPermission(requiredPermissions.user);

        if (!userhasPermission) {
            message.member.send(`You don't have permission to run the \`${cmdName}\` command in **${message.guild.name}**`);
            return false;
        }

        const clientHasPermissions = new Permissions(message.guild.me.permissions)
            .permsToArray()
            .clientHasPermission(requiredPermissions.client);

        if (!clientHasPermissions) {
            message.member.send(`${Kiyo.user.username} doesn't have permission to run the \`${cmdName}\` command in **${message.guild.name}**`);
            return false;
        }

        return true;
        
    } catch (error) {
        return false;
    }
};