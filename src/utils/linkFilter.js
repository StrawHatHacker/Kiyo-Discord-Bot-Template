const { regex } = require('../config');

module.exports = (parsedContent, Guild) => {
    if (!Guild.features.links) return false;

    if (regex.url.test(parsedContent)) return true;

    return false;
};
