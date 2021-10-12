'use strict';

const cache = new Map();

module.exports = (commandName, userId, cooldown) => {
    if (!cache.has(userId)) cache.set(userId, {});
    if (!cache.get(userId)[commandName]) cache.get(userId)[commandName] = false;

    if (cache.get(userId)[commandName] === true) return true;

    cache.get(userId)[commandName] = true;

    setTimeout(() => {
        cache.get(userId)[commandName] = false;
    }, cooldown);

    return false;
};
