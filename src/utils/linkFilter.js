'use strict';

const { regex } = require('../config');

module.exports = (parsedContent) => {
    if (regex.url.test(parsedContent)) return true;

    return false;
};
