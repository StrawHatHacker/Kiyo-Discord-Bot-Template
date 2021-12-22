'use strict';

const { USER_FLAGS, CHANNEL_TYPES } = require('../config');

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

module.exports.prettifyChannelTypeFlags = (flag) => {
    if (typeof flag !== 'string') throw new Error('Flag is not a string');

    if (CHANNEL_TYPES[flag]) return CHANNEL_TYPES[flag];
    else return flag;
};
