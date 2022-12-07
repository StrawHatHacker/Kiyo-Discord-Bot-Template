'use strict';

/**
 * Remove all characters except numbers from a string.
 * Makes "<@!35393876439867>" into "35393876439867"
 * @param {string} arg 
 * @returns {string}
 */
module.exports = arg => arg.replace(/[^0-9]+/g, '');