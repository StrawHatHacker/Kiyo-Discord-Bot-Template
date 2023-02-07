'use strict';

/**
 * @description Limit the length of an array, the correct way
 * @param {number} limit 
 * @returns {Array}
 */
Array.prototype.limit = function (limit) {
    if (!limit || typeof limit !== 'number')
        throw new Error('Argument passed to Array.limit is not a number');

    return this.slice(0, limit);
};

/**
 * @description Remove element from array. The opposite of [].push
 * @param {any} val 
 * @returns {Array}
 */
Array.prototype.pull = function (val) {
    if (!val) return this;

    return this.filter(e => e !== val);
};
