/**
 * Remove all characters except numbers from a string
 * @param {string} arg 
 * @returns {string}
 */
module.exports = (arg) => arg.replace(/[^0-9]+/g, '');