'use strict';

module.exports = roleCollection => {
    // Remove the '@everyone' role from the member and format their roles into a string
    return roleCollection
        .filter(role => role.name !== '@everyone')
        .map(role => role.toString())
        .sort((a, b) => b.rawPoisition - a.rawPoisition)
        .join('')
        .slice(0, 1900);
};
