/**
 * 
 * @param {object} objA 
 * @param {object} objB 
 * @param {string[]} properties 
 * @returns {object}
 */
module.exports = function (objA, objB, properties) {
    const diff = {};

    properties.forEach(prop => {
        if (objA[prop] !== objB[prop]) {
            diff[prop] = {
                from: objA[prop],
                to: objB[prop]
            };
        }
    });

    return diff;
};
