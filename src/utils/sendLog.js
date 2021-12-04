'use strict';

const DateFormatter = require('../utils/DateFormatter');
const prettifyRoles = require('./prettifyRoles');
const Embed = require('../classes/Embed');
const Discord = require('discord.js');
const dayjs = require('dayjs');

// Mapping for each log type to the corresponding "channel id" db field
const logTypeToDBField = {
    moderationlog: 'moderation_log_channel_id',
    messagelog: 'message_log_channel_id',
    serverlog: 'server_log_channel_id',
    memberlog: 'member_log_channel_id'
};

const actionData = {
    warn: {
        type: 'moderationlog',
        color: '#ffc107',
        userGot: 'Warned',
        getEmbed: function ({ person, moderator, reason }) {
            const rolesString = prettifyRoles(person.roles.cache);

            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(person.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor(`${person.user.tag} got ${this.userGot}`,
                    person.user.displayAvatarURL({ dynamic: true, size: 128 }))
                .addField(`${this.userGot} user`, `ID: ${person.id}\n${rolesString ? `Roles: ${rolesString.slice(0, 800)}` : ''}`)
                .addField('Moderator', `${moderator.user.tag}\n${moderator.id}`)
                .addField('Reason', `${reason.slice(0, 1024)}`);
        }
    },
    kick: {
        type: 'moderationlog',
        color: '#e88330',
        userGot: 'Kicked',
        getEmbed: function ({ person, moderator, reason }) {
            const rolesString = prettifyRoles(person.roles.cache);

            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(person.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor(`${person.user.tag} got ${this.userGot}`,
                    person.user.displayAvatarURL({ dynamic: true, size: 128 }))
                .addField(`${this.userGot} user`, `ID: ${person.id}\n${rolesString ? `Roles: ${rolesString.slice(0, 800)}` : ''}`)
                .addField('Moderator', `${moderator.user.tag}\n${moderator.id}`)
                .addField('Reason', `${reason.slice(0, 1024)}`);
        }
    },
    ban: {
        type: 'moderationlog',
        color: '#e83036',
        userGot: 'Banned',
        getEmbed: function ({ person, moderator, reason }) {
            const rolesString = prettifyRoles(person.roles.cache);

            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(person.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor(`${person.user.tag} got ${this.userGot}`,
                    person.user.displayAvatarURL({ dynamic: true, size: 128 }))
                .addField(`${this.userGot} user`, `ID: ${person.id}\n${rolesString ? `Roles: ${rolesString.slice(0, 800)}` : ''}`)
                .addField('Moderator', `${moderator.user.tag}\n${moderator.id}`)
                .addField('Reason', `${reason.slice(0, 1024)}`);
        }
    },
    mute: {
        type: 'moderationlog',
        color: '#e8d454',
        userGot: 'Muted',
        getEmbed: function ({ person, moderator, reason }) {
            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(person.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor(`${person.user.tag} got ${this.userGot}`,
                    person.user.displayAvatarURL({ dynamic: true, size: 128 }))
                .addField(`${this.userGot} user`, `ID: ${person.id}`)
                .addField('Moderator', `${moderator.user.tag}\n${moderator.id}`)
                .addField('Reason', `${reason.slice(0, 1024)}`);
        }
    },
    softban: {
        type: 'moderationlog',
        color: '#f25050',
        userGot: 'Softbanned',
        getEmbed: function ({ person, moderator, reason }) {
            const rolesString = prettifyRoles(person.roles.cache);

            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(person.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor(`${person.user.tag} got ${this.userGot}`,
                    person.user.displayAvatarURL({ dynamic: true, size: 128 }))
                .addField(`${this.userGot} user`, `ID: ${person.id}\n${rolesString ? `Roles: ${rolesString.slice(0, 800)}` : ''}`)
                .addField('Moderator', `${moderator.user.tag}\n${moderator.id}`)
                .addField('Reason', `${reason.slice(0, 1024)}`);
        }
    },
    unban: {
        type: 'moderationlog',
        color: '#eb8714',
        userGot: 'Unbanned',
        getEmbed: function ({ person, moderator, reason }) {
            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(person.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor(`${person.tag} got ${this.userGot}`,
                    person.displayAvatarURL({ dynamic: true, size: 128 }))
                .addField(`${this.userGot} user`, `ID: ${person.id}`)
                .addField('Moderator', `${moderator.user.tag}\n${moderator.id}`)
                .addField('Reason', `${reason.slice(0, 1024)}`);
        }
    },
    unmute: {
        type: 'moderationlog',
        color: '#3b77d8',
        userGot: 'Unmuted',
        getEmbed: function ({ person, moderator, reason }) {
            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(person.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor(`${person.user.tag} got ${this.userGot}`,
                    person.user.displayAvatarURL({ dynamic: true, size: 128 }))
                .addField(`${this.userGot} user`, `ID: ${person.id}`)
                .addField('Moderator', `${moderator.user.tag}\n${moderator.id}`)
                .addField('Reason', `${reason.slice(0, 1024)}`);
        }
    },
    guildMemberAdd: {
        type: 'memberlog',
        color: '#6DD943',
        getEmbed: function ({ person }) {
            const timeSinceCreated = new Date().getTime() - person.joinedAt.getTime();
            const daysSinceCreated = timeSinceCreated / 1000 * 3600 * 24;

            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(person.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor(`${person.user.tag} Joined`,
                    person.user.displayAvatarURL({ dynamic: true, size: 128 }))
                .addField('New user', `ID: ${person.id}\nCreated at ${new DateFormatter(person.joinedAt).formatToReadable()}`);

            if (person.user.flags.toArray().length > 0) e.addField('Flags', person.user.flags.toArray().join('\n'));
            if (daysSinceCreated < 7) e.addField('⚠', `Account created less than ${daysSinceCreated} day(s) before`);

            return e;
        }
    }
};

/**
 * @description Sends a log message to the corresponding log channel
 * @param {warn|kick|ban|softban|mute|unban|unmute} action the action that triggered this log
 * @param {GuildObject} Guild object with guild data from the database
 * @param {Discord.Guild} guild 
 * @param {Discord.GuildMember|Discord.User} member 
 * @param {Discord.GuildMember} moderator 
 * @param {String} reason 
 * @returns {Promise<void>}
 */
module.exports = async (action, Guild, guild, person, moderator, reason) => {
    if (!actionData[action]) throw new Error('Invalid log type');
    if (!(person instanceof Discord.GuildMember) && !(person instanceof Discord.User))
        throw new Error('"person" is not instance of Discord.GuildMember or Discord.User');

    const d = actionData[action];

    // If the feature is disabled by the guild, return
    if (!Guild.features[d.type]) return;
    // Based on the type of log, get the corresponding db field
    // For example, moderationlog -> moderation_log_channel_id
    const db_field = logTypeToDBField[d.type];

    // If the log channel for that feature is not set, return
    if (Guild[db_field] === '') return;

    const channel = guild.channels.cache.get(Guild[db_field]);
    if (!channel) return;

    // call getEmbed to create an embed
    const e = d.getEmbed({ person, moderator, reason, guild });

    await channel.send({ embeds: [e] });
};
