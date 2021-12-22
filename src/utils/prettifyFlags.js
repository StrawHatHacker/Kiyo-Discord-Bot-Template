'use strict';

const { USER_FLAGS } = require('../config');

module.exports.prettifyUserFlags = (flagArray) => {
    if (!Array.isArray(flagArray)) throw new Error('Flag array is not an array');

    let prettyFlagArray = [];

    for (const flag of flagArray) {
        if (USER_FLAGS[flag]) {
            prettyFlagArray.push(USER_FLAGS[flag]);
        } else {
            prettyFlagArray.push(flag);
        }
    }

    return prettyFlagArray;
};
