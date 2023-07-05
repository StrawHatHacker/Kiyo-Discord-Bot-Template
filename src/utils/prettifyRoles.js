'use strict';

// eslint-disable-next-line no-unused-vars
const { Collection} = require('discord.js');

/**
 * @param {Collection} roleCollection
 */
module.exports = (roleCollection) => {
    // Remove the '@everyone' role from the member and format their roles into a string
    return roleCollection
        .filter(role => role?.name !== '@everyone')
        .map(role => role?.toString())
        .sort((a, b) => b?.rawPoisition - a?.rawPoisition)
        .limit(20)
        .join('')
        .slice(0, 1900);
};
