'use strict';

const { Message } = require('discord.js');
const Err = require('../classes/Err');

/**
 * @param {Err|Error} e 
 * @param {Message} m 
 */
module.exports = (e, m) => {
    if (!(e instanceof Err) && !(e instanceof Error))
        throw new Error('Parameter `e` is neither instance of `Err` or `Error`');
    if (!(m instanceof Message))
        throw new Error('Parameter `m` is not instance of `Message`');

    // 404 Not Found
    if (e.httpStatus === 404 || e.httpStatus === 401 || e.httpStatus === 400) m.channel.send(`${e.name}: ${e.message}`);

    // 403 Missing Permissions
    // BE CAREFUL, you might not see errors in your console because of this line
    // usually triggers when the bot doesn't have permissions to do something
    else if (e.httpStatus === 403) return;

    // All other errors
    else {
        console.log(e);
        m.channel.send('Unknown Error');
    }
};
