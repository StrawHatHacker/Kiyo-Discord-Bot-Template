'use strict';

const { BaseInteraction } = require('discord.js');
const Err = require('../classes/Err');

/**
 * @param {Err|Error} e 
 * @param {BaseInteraction} i 
 */
module.exports = (e, i) => {
    if (!(e instanceof Err) && !(e instanceof Error))
        throw new Error('Parameter `e` is neither instance of `Err` or `Error`');
    if (!(i instanceof BaseInteraction))
        throw new Error('Parameter `m` is not instance of `BaseInteraction`');

    // 404 Not Found
    if (e.httpStatus === 404 || e.httpStatus === 401 || e.httpStatus === 400) i.reply({ content: `${e.name}: ${e.message}`, ephemeral: true });

    // 403 Missing Permissions
    // BE CAREFUL, you might not see errors in your console because of this line
    // usually triggers when the bot doesn't have permissions to do something
    else if (e.httpStatus === 403) return;

    // All other errors
    else {
        console.log(e);
        i.reply({ content: 'Unknown Error', ephemeral: true });
    }
};
