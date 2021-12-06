'use strict';

const DateFormatter = require('../utils/DateFormatter');
const prettifyRoles = require('./prettifyRoles');
const Embed = require('../classes/Embed');

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
        getEmbed: function ({ item, moderator, reason }) {
            const rolesString = prettifyRoles(item.roles.cache);

            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(item.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor(`${item.user.tag} got ${this.userGot}`,
                    item.user.displayAvatarURL({ dynamic: true, size: 128 }))
                .addField(`${this.userGot} user`, `ID: ${item.id}\n${rolesString ? `Roles: ${rolesString.slice(0, 800)}` : ''}`)
                .addField('Moderator', `${moderator.user.tag}\n${moderator.id}`)
                .addField('Reason', `${reason.slice(0, 1024)}`);
        }
    },
    kick: {
        type: 'moderationlog',
        color: '#e88330',
        userGot: 'Kicked',
        getEmbed: function ({ item, moderator, reason }) {
            const rolesString = prettifyRoles(item.roles.cache);

            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(item.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor(`${item.user.tag} got ${this.userGot}`,
                    item.user.displayAvatarURL({ dynamic: true, size: 128 }))
                .addField(`${this.userGot} user`, `ID: ${item.id}\n${rolesString ? `Roles: ${rolesString.slice(0, 800)}` : ''}`)
                .addField('Moderator', `${moderator.user.tag}\n${moderator.id}`)
                .addField('Reason', `${reason.slice(0, 1024)}`);
        }
    },
    ban: {
        type: 'moderationlog',
        color: '#e83036',
        userGot: 'Banned',
        getEmbed: function ({ item, moderator, reason }) {
            const rolesString = prettifyRoles(item.roles.cache);

            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(item.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor(`${item.user.tag} got ${this.userGot}`,
                    item.user.displayAvatarURL({ dynamic: true, size: 128 }))
                .addField(`${this.userGot} user`, `ID: ${item.id}\n${rolesString ? `Roles: ${rolesString.slice(0, 800)}` : ''}`)
                .addField('Moderator', `${moderator.user.tag}\n${moderator.id}`)
                .addField('Reason', `${reason.slice(0, 1024)}`);
        }
    },
    mute: {
        type: 'moderationlog',
        color: '#e8d454',
        userGot: 'Muted',
        getEmbed: function ({ item, moderator, reason }) {
            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(item.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor(`${item.user.tag} got ${this.userGot}`,
                    item.user.displayAvatarURL({ dynamic: true, size: 128 }))
                .addField(`${this.userGot} user`, `ID: ${item.id}`)
                .addField('Moderator', `${moderator.user.tag}\n${moderator.id}`)
                .addField('Reason', `${reason.slice(0, 1024)}`);
        }
    },
    softban: {
        type: 'moderationlog',
        color: '#f25050',
        userGot: 'Softbanned',
        getEmbed: function ({ item, moderator, reason }) {
            const rolesString = prettifyRoles(item.roles.cache);

            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(item.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor(`${item.user.tag} got ${this.userGot}`,
                    item.user.displayAvatarURL({ dynamic: true, size: 128 }))
                .addField(`${this.userGot} user`, `ID: ${item.id}\n${rolesString ? `Roles: ${rolesString.slice(0, 800)}` : ''}`)
                .addField('Moderator', `${moderator.user.tag}\n${moderator.id}`)
                .addField('Reason', `${reason.slice(0, 1024)}`);
        }
    },
    unban: {
        type: 'moderationlog',
        color: '#eb8714',
        userGot: 'Unbanned',
        getEmbed: function ({ item, moderator, reason }) {
            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(item.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor(`${item.tag} got ${this.userGot}`,
                    item.displayAvatarURL({ dynamic: true, size: 128 }))
                .addField(`${this.userGot} user`, `ID: ${item.id}`)
                .addField('Moderator', `${moderator.user.tag}\n${moderator.id}`)
                .addField('Reason', `${reason.slice(0, 1024)}`);
        }
    },
    unmute: {
        type: 'moderationlog',
        color: '#3b77d8',
        userGot: 'Unmuted',
        getEmbed: function ({ item, moderator, reason }) {
            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(item.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor(`${item.user.tag} got ${this.userGot}`,
                    item.user.displayAvatarURL({ dynamic: true, size: 128 }))
                .addField(`${this.userGot} user`, `ID: ${item.id}`)
                .addField('Moderator', `${moderator.user.tag}\n${moderator.id}`)
                .addField('Reason', `${reason.slice(0, 1024)}`);
        }
    },
    guildMemberAdd: {
        type: 'memberlog',
        color: '#6DD943',
        getEmbed: function ({ item }) {
            const timeSinceCreated = new Date().getTime() - item.joinedAt.getTime();

            const daysSinceCreated = timeSinceCreated / 1000 * 3600 * 24;

            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(item.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor(`${item.user.tag} Joined`,
                    item.user.displayAvatarURL({ dynamic: true, size: 128 }))
                .addField('New user', `ID: ${item.id}\nCreated at ${new DateFormatter(item.joinedAt).formatToReadable()}`);

            if (item.user.flags.toArray().length > 0) e.addField('Flags', item.user.flags.toArray().join('\n'));
            if (daysSinceCreated < 7) e.addField('⚠', `Account created less than ${daysSinceCreated} day(s) before`);

            return e;
        }
    },
    channelCreate: {
        type: 'serverlog',
        color: '#6DD943',
        getEmbed: function ({ item }) {
            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor('Channel Created')
                .setDescription(`Name: ${item.name}\nID: ${item.id}${item.parent?.name ? `\nCategory: ${item.parent.name}` : ''}\nType: ${item.type}`);
        }
    },
    channelDelete: {
        type: 'serverlog',
        color: '#e83036',
        getEmbed: function ({ item }) {
            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor('Channel Deleted')
                .setDescription(`Name: ${item.name}\nID: ${item.id}${item.parent?.name ? `\nCategory: ${item.parent.name}` : ''}\nType: ${item.type}`);
        }
    },
    channelUpdate: {
        type: 'serverlog',
        color: '#eb8714',
        getEmbed: function ({ item }) {
            const [oldChannel, newChannel] = item;

            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor('Channel Updated');

            if (oldChannel.name !== newChannel.name)
                e.addDescription(`Name: ${oldChannel.name} => ${newChannel.name}`);
            else e.addDescription(`Name:  ${newChannel.name}`);

            e.addDescription(`ID: ${newChannel.id}`);

            if (oldChannel.parentId !== newChannel.parentId)
                e.addDescription(`Category: ${oldChannel.parent.name} => ${newChannel.parent.name}`);

            if (oldChannel.type !== newChannel.type)
                e.addDescription(`Type: ${oldChannel.type} => ${newChannel.type}`);

            if (oldChannel.topic !== newChannel.topic)
                e.addDescription(`Topic: ${oldChannel.topic?.slice(0, 500) || 'None'} => ${newChannel.topic?.slice(0, 500) || 'None'}`);

            if (oldChannel.nsfw !== newChannel.nsfw)
                e.addDescription(`NSFW: ${oldChannel.nsfw} => ${newChannel.nsfw}`);

            if (oldChannel.rawPosition !== newChannel.rawPosition)
                e.addDescription(`Position: ${oldChannel.rawPosition + 1} => ${newChannel.rawPosition + 1}`);

            if (oldChannel.rtcRegion !== newChannel.rtcRegion)
                e.addDescription(`Region: ${oldChannel.rtcRegion || 'Automatic'} => ${newChannel.rtcRegion || 'Automatic'}`);

            if (oldChannel.userLimit !== newChannel.userLimit)
                e.addDescription(`User limit: ${oldChannel.userLimit} => ${newChannel.userLimit}`);

            if (oldChannel.bitrate !== newChannel.bitrate)
                e.addDescription(`Bitrate: ${Math.floor(oldChannel.bitrate / 1000)}kbps => ${Math.floor(newChannel.bitrate / 1000)}kbps`);

            return e;
        }
    },
    emojiCreate: {
        type: 'serverlog',
        color: '#6DD943',
        getEmbed: function ({ item }) {
            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor('Emoji Added')
                .setThumbnail(item.url)
                .setDescription(`Name: ${item.name}\nID: ${item.id}`);
        }
    },
    emojiDelete: {
        type: 'serverlog',
        color: '#e83036',
        getEmbed: function ({ item }) {
            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor('Emoji Deleted')
                .setThumbnail(item.url)
                .setDescription(`Name: ${item.name}\nID: ${item.id}`);
        }
    },
    emojiUpdate: {
        type: 'serverlog',
        color: '#3b77d8',
        getEmbed: function ({ item }) {
            const [oldEmoji, newEmoji] = item;

            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor('Emoji Updated')
                .setThumbnail(newEmoji.url)
                .setDescription(`Name: ${oldEmoji.name} => ${newEmoji.name}\nID: ${newEmoji.id}`);
        }
    }
};

/**
 * @description Sends a log message to the corresponding log channel
 * @param {warn|kick|ban|softban|mute|unban|unmute} action the action that triggered this log
 * @param {GuildObject} Guild object with guild data from the database
 * @param {Discord.Guild} guild 
 * @param {} item It's an item passed to get embed function. Usually is a GuildMember or User 
 * @param {Discord.GuildMember} moderator 
 * @param {String} reason 
 * @returns {Promise<void>}
 */
module.exports = async (action, Guild, guild, item, moderator, reason) => {
    if (!actionData[action]) throw new Error('Invalid log type');

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
    const e = d.getEmbed({ item, moderator, reason, guild });

    await channel.send({ embeds: [e] });
};
