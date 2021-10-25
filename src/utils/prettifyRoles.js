'use strict';

module.exports = roleCollection => {
    // Remove the '@everyone' role from the member and format their roles into a string
    return roleCollection
        .filter(role => role.name !== '@everyone')
        .map(role => role.toString())
        .join('')
        .slice(0, 1900);
};
