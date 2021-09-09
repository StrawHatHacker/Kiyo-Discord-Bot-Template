const { GuildMember } = require('discord.js');

/**
 * 
 * @param {String} str 
 * @param {GuildMember} member 
 * @returns string
 */
const replaceFlags = (str, member) => {
    if (!(member instanceof GuildMember)) throw new Error('Parameter member is not instance of GuildMember');

    return str.replace(/{username}/g, member.user.username)
        .replace(/{mention}/g, member.toString())
        .replace(/{joinedAt}/g, member.joinedAt.toUTCString())
        .replace(/{color}/g, member.displayColor)
        .replace(/{tag}/g, member.user.tag)
        .replace(/{id}/g, member.id);
};

/**
 * 
 * @param {*} EmbedProps 
 * @param {GuildMember} member 
 * @returns {EmbedProps}
 */
module.exports = (EmbedProps, member) => {
    EmbedProps.content = replaceFlags(EmbedProps.content, member);
    EmbedProps.title = replaceFlags(EmbedProps.title, member);
    EmbedProps.description = replaceFlags(EmbedProps.description, member);
    EmbedProps.author.name = replaceFlags(EmbedProps.author.name, member);
    EmbedProps.footer.text = replaceFlags(EmbedProps.footer.text, member);
    EmbedProps.fields = EmbedProps.fields.map(f => {
        return {
            name: replaceFlags(f.name, member),
            value: replaceFlags(f.value, member),
            inline: f.inline
        };
    });
    if (EmbedProps.color === null) EmbedProps.color = member.displayColor;
    if (EmbedProps.timestamp === null) EmbedProps.timestamp = member.joinedAt;

    return EmbedProps;
};
