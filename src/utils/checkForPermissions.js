'use strict';

const Permissions = require('../classes/Permissions');
const { Message } = require('discord.js');
const Err = require('../classes/Err');

/**
 * @param {Message} message 
 * @param {String} cmdName 
 * @param {Object} requiredPermissions
 * @param {String[]} requiredPermissions.user
 * @param {String[]} requiredPermissions.client
 * @returns {Boolean} true/false
 */
module.exports = (message, cmdName, requiredPermissions) => {
    try {
        if (!(message instanceof Message))
            throw new Err(400).inputErr().setMessage('Parameter `message` should be an instance of `Message`');
        if (typeof cmdName !== 'string')
            throw new Err(400).inputErr().setMessage('Parameter `cmdName` should be a type of `string`');
        if (!Array.isArray(requiredPermissions.user) || !Array.isArray(requiredPermissions.client))
            throw new Err(400).inputErr().setMessage('Parameter `requiredPermissions` is not correctly formatted');

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
            message.member.send(`${message.guild.me.user.username} doesn't have permission to run the \`${cmdName}\` command in **${message.guild.name}**`);
            return false;
        }

        return true;

    } catch (error) {
        console.log(error);
        return false;
    }
};
