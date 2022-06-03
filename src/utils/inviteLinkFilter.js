module.exports = (parsedContent, Guild) => {
    if (!Guild.features.invitelinks) return false;

    let content = parsedContent;

    if (Guild.security_policy === 'off') {

        if (content.includes('discord.gg/')) return true;

    } else if (Guild.security_policy === 'low') {

        if (
            content.includes('discord.gg/') ||
            content.includes('discordapp.com/invite/')
        ) return true;

    } else if (Guild.security_policy === 'medium') {

        if (
            content.includes('discord.gg/') ||
            content.includes('discordapp.com/invite/') ||
            content.includes('discord.me/') ||
            content.includes('discord.io/') ||
            content.includes('top.gg/bots/') ||
            content.includes('top.gg/servers/')
        ) return true;

    } else if (Guild.security_policy === 'high') {
        if (
            content.includes('discord.gg/') ||
            content.includes('discordapp.com/invite/') ||
            content.includes('discord.me/') ||
            content.includes('discord.io/') ||
            content.includes('top.gg/bots/') ||
            content.includes('top.gg/servers/') ||
            content.includes('discordservers.com/server/') ||
            content.includes('https://discords.com/servers/') ||
            content.includes('discord.st/server/')
        ) return true;
    }

    return false;
};