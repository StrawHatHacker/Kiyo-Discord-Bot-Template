module.exports = (message, Guild) => {
    if (message.member.permissions.has('ADMINISTRATOR') ||
        message.member.permissions.has('MANAGE_GUILD') ||
        message.member.permissions.has('MANAGE_CHANNELS') ||
        message.member.permissions.has('MANAGE_MESSAGES')) return false;

    let content = message.content.toLowerCase().replace(/\n/g, '');
    let words = Guild.filtered_words;
    let found = [];

    if (Guild.security_policy === 'off' || Guild.security_policy === 'low') {

        content = content.replace(/ +/g, ' ');
        for (const badWord of words) if (content.includes(badWord)) found.push(badWord);

    } else if (Guild.security_policy === 'medium') {

        content = content.replace(/ +/g, '');
        for (const badWord of words) if (content.indexOf(badWord) !== -1) found.push(badWord);

    } else if (Guild.security_policy === 'high') {

        content = content.replace(/ +/g, '').replace(/[^a-zA-Z0-9]/g, '');
        for (const badWord of words) if (content.includes(badWord)) found.push(badWord);

    }

    if (found.length === 0) return false;
    return found;
};
