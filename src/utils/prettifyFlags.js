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

module.exports.prettifyChannelTypeFlags = (flag) => {
    if (typeof flag !== 'string') throw new Error('Flag is not a string');

    if (USER_FLAGS[flag]) return USER_FLAGS[flag];
    else return flag;
};
