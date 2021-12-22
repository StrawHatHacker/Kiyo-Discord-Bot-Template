'use strict';

/**
 * @description limit the length of an array, the correct way
 * @param {number} limit 
 * @returns {Array}
 */
Array.prototype.limit = function (limit) {
    if (!limit || typeof limit !== 'number')
        throw new Error('Argument passed to Array.limit is not a number');

    return this.slice(0, limit);
};
