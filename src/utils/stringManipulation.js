'use strict';

/**
 * @description Loops through an array of strings and format the array into a string, based on the wrapper and the word.
 * @param {String[]} arrayOfStrings 
 * @param {String} wrapper 
 * @param {String} word 
 * @returns {String}
 */
function loop(arrayOfStrings, wrapper, word) {
    let str = '';
    let wrapChar = wrapper ?? '';

    for (let i = 0; i < arrayOfStrings.length; i++) {
        // Add a comma to the first charaelementcter
        if (i === 0) {
            str = wrapChar + arrayOfStrings[i] + wrapChar + ', ';
            continue;
        }

        // if the element is the one before the last, meaning before we add the "and" then we dont add a comma
        if (i === arrayOfStrings.length - 2) {
            str += wrapChar + arrayOfStrings[i] + wrapChar + ' ';
            continue;
        }

        // Add the "word" to the last character
        if (i === arrayOfStrings.length - 1) {
            str += word + ' ' + wrapChar + arrayOfStrings[i] + wrapChar;
            continue;
        }

        // In all other cases wrap the element and add a comma
        str += ' ' + wrapChar + arrayOfStrings[i] + wrapChar + ', ';
    }

    return str;
}

/**
 * @description 
 * @param {String[]} arrayOfStrings 
 * @param {String} wrapper 
 * @returns {String}
 */
module.exports.and = (arrayOfStrings, wrapper) => loop(arrayOfStrings, wrapper, 'and');
/**
 * @description 
 * @param {String[]} arrayOfStrings 
 * @param {String} wrapper 
 * @returns {String}
 */
module.exports.or = (arrayOfStrings, wrapper) => loop(arrayOfStrings, wrapper, 'or');
