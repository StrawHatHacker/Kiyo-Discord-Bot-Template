'use strict';

const { prettifyUserFlags, prettifyChannelTypeFlags } = require('../utils/prettifyFlags');
const DateFormatter = require('../utils/DateFormatter');
const Permissions = require('../classes/Permissions');
const prettifyRoles = require('./prettifyRoles');
const Embed = require('../classes/Embed');
const { colors } = require('../config');
const wait = require('../utils/wait');

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
        color: colors.orangePrimary,
        userGot: 'Warned',
        getEmbed: function ({ item, moderator, reason }) {
            const [memberToWarn, NewCase] = item;
            const rolesString = prettifyRoles(memberToWarn.roles.cache);

            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(memberToWarn.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor({
                    name: `${memberToWarn.user.tag} got ${this.userGot}`,
                    iconURL: memberToWarn.user.displayAvatarURL({ dynamic: true, size: 128 })
                })
                .addField(`${this.userGot} user`, `ID: ${memberToWarn.id}\n${rolesString ? `Roles: ${rolesString}` : ''}`)
                .addField('Moderator', `${moderator.user.tag}\n${moderator.id}`)
                .addField('Reason', `${reason.slice(0, 1024)}`)
                .setFooter({ text: `Case #${NewCase.case}` });
        }
    },
    kick: {
        type: 'moderationlog',
        color: colors.redSecondary,
        userGot: 'Kicked',
        getEmbed: function ({ item, moderator, reason }) {
            const [memberToKick, NewCase] = item;
            const rolesString = prettifyRoles(memberToKick.roles.cache);

            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(memberToKick.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor({
                    name: `${memberToKick.user.tag} got ${this.userGot}`,
                    iconURL: memberToKick.user.displayAvatarURL({ dynamic: true, size: 128 })
                })
                .addField(`${this.userGot} user`, `ID: ${memberToKick.id}\n${rolesString ? `Roles: ${rolesString}` : ''}`)
                .addField('Moderator', `${moderator.user.tag}\n${moderator.id}`)
                .addField('Reason', `${reason.slice(0, 1024)}`)
                .setFooter({ text: `Case #${NewCase.case}` });
        }
    },
    ban: {
        type: 'moderationlog',
        color: colors.redPrimary,
        userGot: 'Banned',
        getEmbed: function ({ item, moderator, reason }) {
            const [memberToBan, NewCase] = item;
            const rolesString = prettifyRoles(memberToBan.roles.cache);

            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(memberToBan.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor({
                    name: `${memberToBan.user.tag} got ${this.userGot}`,
                    iconURL: memberToBan.user.displayAvatarURL({ dynamic: true, size: 128 })
                })
                .addField(`${this.userGot} user`, `ID: ${memberToBan.id}\n${rolesString ? `Roles: ${rolesString}` : ''}`)
                .addField('Moderator', `${moderator.user.tag}\n${moderator.id}`)
                .addField('Reason', `${reason.slice(0, 1024)}`)
                .setFooter({ text: `Case #${NewCase.case}` });
        }
    },
    mute: {
        type: 'moderationlog',
        color: colors.orangePrimary,
        userGot: 'Muted',
        getEmbed: function ({ item, moderator, reason }) {
            const [memberToMute, NewCase] = item;

            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(memberToMute.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor({
                    name: `${memberToMute.user.tag} got ${this.userGot}`,
                    iconURL: memberToMute.user.displayAvatarURL({ dynamic: true, size: 128 })
                })
                .addField(`${this.userGot} user`, `ID: ${memberToMute.id}`)
                .addField('Moderator', `${moderator.user.tag}\n${moderator.id}`)
                .addField('Reason', `${reason.slice(0, 1024)}`)
                .setFooter({ text: `Case #${NewCase.case}` });
        }
    },
    softban: {
        type: 'moderationlog',
        color: colors.redSecondary,
        userGot: 'Softbanned',
        getEmbed: function ({ item, moderator, reason }) {
            const [memberToBan, NewCase] = item;
            const rolesString = prettifyRoles(memberToBan.roles.cache);

            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(memberToBan.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor({
                    name: `${memberToBan.user.tag} got ${this.userGot}`,
                    iconURL: memberToBan.user.displayAvatarURL({ dynamic: true, size: 128 })
                })
                .addField(`${this.userGot} user`, `ID: ${memberToBan.id}\n${rolesString ? `Roles: ${rolesString}` : ''}`)
                .addField('Moderator', `${moderator.user.tag}\n${moderator.id}`)
                .addField('Reason', `${reason.slice(0, 1024)}`)
                .setFooter({ text: `Case #${NewCase.case}` });
        }
    },
    unban: {
        type: 'moderationlog',
        color: colors.orangePrimary,
        userGot: 'Unbanned',
        getEmbed: function ({ item, moderator, reason }) {
            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(item.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor({
                    name: `${item.tag} got ${this.userGot}`,
                    iconURL: item.displayAvatarURL({ dynamic: true, size: 128 })
                })
                .addField(`${this.userGot} user`, `ID: ${item.id}`)
                .addField('Moderator', `${moderator.user.tag}\n${moderator.id}`)
                .addField('Reason', `${reason.slice(0, 1024)}`);
        }
    },
    unmute: {
        type: 'moderationlog',
        color: colors.yellowPrimary,
        userGot: 'Unmuted',
        getEmbed: function ({ item, moderator, reason }) {
            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(item.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor({
                    name: `${item.user.tag} got ${this.userGot}`,
                    iconURL: item.user.displayAvatarURL({ dynamic: true, size: 128 })
                })
                .addField(`${this.userGot} user`, `ID: ${item.id}`)
                .addField('Moderator', `${moderator.user.tag}\n${moderator.id}`)
                .addField('Reason', `${reason.slice(0, 1024)}`);
        }
    },
    guildMemberAdd: {
        type: 'memberlog',
        color: colors.greenPrimary,
        getEmbed: function ({ item }) {
            const timeSinceCreated = new Date().getTime() - item.user.createdAt.getTime();

            const daysSinceCreated = timeSinceCreated / 1000 * 3600 * 24;

            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(item.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor({
                    name: `${item.user.tag} Joined`,
                    iconURL: item.user.displayAvatarURL({ dynamic: true, size: 128 })
                })
                .addField('User', `ID: ${item.id}\nCreated at: ${new DateFormatter(item.user.createdAt).formatToReadable()}`);

            if (item.user.flags.toArray().length > 0) e.addField('Flags', prettifyUserFlags(item.user.flags.toArray()).join(', '));
            if (daysSinceCreated < 7) e.addField('⚠', `Account created less than ${daysSinceCreated} day(s) before`);

            return e;
        }
    },
    guildMemberRemove: {
        type: 'memberlog',
        color: colors.orangePrimary,
        getEmbed: function ({ item }) {
            const rolesString = prettifyRoles(item.roles.cache);

            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(item.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor({
                    name: `${item.user.tag} Left`,
                    iconURL: item.user.displayAvatarURL({ dynamic: true, size: 128 })
                })
                .addField('User', `ID: ${item.id}\nCreated at ${new DateFormatter(item.user.createdAt).formatToReadable()}${rolesString ? `\nRoles: ${rolesString}` : ''}`);

            if (item.user.flags.toArray().length > 0) e.addField('Flags', prettifyUserFlags(item.user.flags.toArray()).join('\n'));

            return e;
        }
    },
    channelCreate: {
        type: 'serverlog',
        color: colors.greenPrimary,
        getEmbed: async function ({ item, guild }) {

            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor({ name: 'Channel Created' })
                .setDescription(`Name: ${item.name}\nID: ${item.id}${item.parent?.name ? `\nCategory: ${item.parent.name}` : ''}\nType: ${prettifyChannelTypeFlags(item.type)}`);

            if (guild.members.me.permissions.has('VIEW_AUDIT_LOG', true)) {
                const auditLog = await guild.fetchAuditLogs({ type: 'CHANNEL_CREATE', limit: 1 }).then(auditLogs => auditLogs.entries.first());
                if (auditLog.target.id === item.id) e.setFooter({ text: `Moderator: ${auditLog.executor.tag}\nID: ${auditLog.executor.id}` });
            }

            return e;
        }
    },
    channelDelete: {
        type: 'serverlog',
        color: colors.redPrimary,
        getEmbed: async function ({ item, guild }) {
            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor({ name: 'Channel Deleted' })
                .setDescription(`Name: ${item.name}\nID: ${item.id}${item.parent?.name ? `\nCategory: ${item.parent.name}` : ''}\nType: ${prettifyChannelTypeFlags(item.type)}`);

            if (guild.members.me.permissions.has('VIEW_AUDIT_LOG', true)) {
                const auditLog = await guild.fetchAuditLogs({ type: 'CHANNEL_DELETE', limit: 1 }).then(auditLogs => auditLogs.entries.first());
                if (auditLog.target.id === item.id) e.setFooter({ text: `Moderator: ${auditLog.executor.tag}\nID: ${auditLog.executor.id}` });
            }

            return e;
        }
    },
    channelUpdate: {
        type: 'serverlog',
        color: colors.orangePrimary,
        getEmbed: async function ({ item, guild }) {
            const [oldChannel, newChannel] = item;

            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor({ name: 'Channel Updated' });

            if (oldChannel.name !== newChannel.name)
                e.addDescription(`Name: ${oldChannel.name} => ${newChannel.name}`);
            else e.addDescription(`Name:  ${newChannel.name}`);

            e.addDescription(`ID: ${newChannel.id}`);

            if (oldChannel.parentId !== newChannel.parentId)
                e.addDescription(`Category: ${oldChannel.parent.name} => ${newChannel.parent.name}`);

            if (oldChannel.type !== newChannel.type)
                e.addDescription(`Type: ${prettifyChannelTypeFlags(oldChannel.type)} => ${prettifyChannelTypeFlags(newChannel.type)}`);

            if (oldChannel.topic !== newChannel.topic)
                e.addDescription(`Topic: ${oldChannel.topic?.slice(0, 500) || 'None'} => ${newChannel.topic?.slice(0, 500) || 'None'}`);

            if (oldChannel.nsfw !== newChannel.nsfw)
                e.addDescription(`NSFW: ${oldChannel.nsfw} => ${newChannel.nsfw}`);

            if (oldChannel.rtcRegion !== newChannel.rtcRegion)
                e.addDescription(`Region: ${oldChannel.rtcRegion || 'Automatic'} => ${newChannel.rtcRegion || 'Automatic'}`);

            if (oldChannel.userLimit !== newChannel.userLimit)
                e.addDescription(`User limit: ${oldChannel.userLimit} => ${newChannel.userLimit}`);

            if (oldChannel.bitrate !== newChannel.bitrate)
                e.addDescription(`Bitrate: ${Math.floor(oldChannel.bitrate / 1000)}kbps => ${Math.floor(newChannel.bitrate / 1000)}kbps`);

            if (e.description === '' || e.description === null) return null;

            if (guild.members.me.permissions.has('VIEW_AUDIT_LOG', true)) {
                const auditLog = await guild.fetchAuditLogs({ type: 'CHANNEL_UPDATE', limit: 1 }).then(auditLogs => auditLogs.entries.first());
                if (auditLog.target.id === newChannel.id) e.setFooter({ text: `Moderator: ${auditLog.executor.tag}\nID: ${auditLog.executor.id}` });
            }

            return e;
        }
    },
    emojiCreate: {
        type: 'serverlog',
        color: colors.greenPrimary,
        getEmbed: async function ({ item, guild }) {
            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor({ name: 'Emoji Added' })
                .setThumbnail(item.url)
                .setDescription(`Name: ${item.name}\nID: ${item.id}`);

            if (guild.members.me.permissions.has('VIEW_AUDIT_LOG', true)) {
                const auditLog = await guild.fetchAuditLogs({ type: 'EMOJI_CREATE', limit: 1 }).then(auditLogs => auditLogs.entries.first());
                if (auditLog.target.id === item.id) e.setFooter({ text: `Moderator: ${auditLog.executor.tag}\nID: ${auditLog.executor.id}` });
            }

            return e;
        }
    },
    emojiDelete: {
        type: 'serverlog',
        color: colors.redPrimary,
        getEmbed: async function ({ item, guild }) {
            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor({ name: 'Emoji Deleted' })
                .setThumbnail(item.url)
                .setDescription(`Name: ${item.name}\nID: ${item.id}`);

            if (guild.members.me.permissions.has('VIEW_AUDIT_LOG', true)) {
                const auditLog = await guild.fetchAuditLogs({ type: 'EMOJI_DELETE', limit: 1 }).then(auditLogs => auditLogs.entries.first());
                if (auditLog.target.id === item.id) e.setFooter({ text: `Moderator: ${auditLog.executor.tag}\nID: ${auditLog.executor.id}` });
            }

            return e;
        }
    },
    emojiUpdate: {
        type: 'serverlog',
        color: colors.orangePrimary,
        getEmbed: async function ({ item, guild }) {
            const [oldEmoji, newEmoji] = item;

            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor({ name: 'Emoji Updated' })
                .setThumbnail(newEmoji.url)
                .setDescription(`Name: ${oldEmoji.name} => ${newEmoji.name}\nID: ${newEmoji.id}`);

            if (guild.members.me.permissions.has('VIEW_AUDIT_LOG', true)) {
                const auditLog = await guild.fetchAuditLogs({ type: 'EMOJI_UPDATE', limit: 1 }).then(auditLogs => auditLogs.entries.first());
                if (auditLog.target.id === newEmoji.id) e.setFooter({ text: `Moderator: ${auditLog.executor.tag}\nID: ${auditLog.executor.id}` });
            }
            return e;
        }
    },
    guildBanAdd: {
        type: 'serverlog',
        color: colors.redSecondary,
        getEmbed: async function ({ item, guild }) {
            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(item.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor({
                    name: `${item.user.tag} got banned`,
                    iconURL: item.user.displayAvatarURL({ dynamic: true, size: 128 })
                })
                .addField('Banned user', `ID: ${item.user.id}`)
                .addField('Reason', `${item.reason?.slice(0, 1024) || 'No reason provided'}`);

            if (guild.members.me.permissions.has('VIEW_AUDIT_LOG', true)) {
                const auditLog = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD', limit: 1 }).then(auditLogs => auditLogs.entries.first());
                if (auditLog.target.id === item.user.id) e.setFooter({ text: `Moderator: ${auditLog.executor.tag}\nID: ${auditLog.executor.id}` });
            }

            return e;
        }
    },
    guildBanRemove: {
        type: 'serverlog',
        color: colors.orangePrimary,
        getEmbed: async function ({ item, guild }) {
            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(item.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor({
                    name: `${item.user.tag} got unbanned`,
                    iconURL: item.user.displayAvatarURL({ dynamic: true, size: 128 })
                })
                .addField('Unbanned user', `ID: ${item.user.id}`);

            if (guild.members.me.permissions.has('VIEW_AUDIT_LOG', true)) {
                const auditLog = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_REMOVE', limit: 1 }).then(auditLogs => auditLogs.entries.first());
                if (auditLog.target.id === item.user.id) e.setFooter({ text: `Moderator: ${auditLog.executor.tag}\nID: ${auditLog.executor.id}` });
            }

            return e;
        }
    },
    guildUpdate: {
        type: 'serverlog',
        color: colors.orangePrimary,
        getEmbed: async function ({ item, guild }) {
            const [oldGuild, newGuild] = item;

            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(newGuild.iconURL({ dynamic: true, size: 2048 }))
                .setAuthor({ name: 'Server Update', iconURL: newGuild.iconURL({ dynamic: true, size: 128 }) });

            if (oldGuild.name !== newGuild.name) e.addDescription(`Name: ${oldGuild.name} => ${newGuild.name}`);

            if (oldGuild.afkChannelId !== newGuild.afkChannelId) {
                e.addDescription(`AFK channel: ${oldGuild.afkChannel?.name || 'Not set'} => ${newGuild.afkChannel?.name || 'Unset'}`);
            }

            if (oldGuild.afkTimeout !== newGuild.afkTimeout) {
                e.addDescription(`AFK timeout: ${oldGuild.afkTimeout / 60} minute(s) => ${newGuild.afkTimeout / 60} minute(s)`);
            }

            if (oldGuild.banner !== newGuild.banner) {
                const oldBanner = oldGuild.bannerURL({ dynamic: true, size: 2048 });
                const newBanner = newGuild.bannerURL({ dynamic: true, size: 2048 });
                e.addDescription(`Banner: ${oldBanner || 'Not set'} => ${newBanner || 'Unset'}`);
            }

            if (oldGuild.premiumSubscriptionCount !== newGuild.premiumSubscriptionCount) {
                e.addDescription(`Boosts: ${oldGuild.premiumSubscriptionCount} => ${newGuild.premiumSubscriptionCount}`);
                return e;
            }

            if (oldGuild.explicitContentFilter !== newGuild.explicitContentFilter) {
                e.addDescription(`Explicit content filter: ${oldGuild.explicitContentFilter} => ${newGuild.explicitContentFilter}`);
            }

            if (oldGuild.mfaLevel !== newGuild.mfaLevel) {
                e.addDescription(`MFA level: ${oldGuild.mfaLevel} => ${newGuild.mfaLevel}`);
            }

            if (oldGuild.defaultMessageNotifications !== newGuild.defaultMessageNotifications) {
                e.addDescription(`Default message notifications: ${oldGuild.defaultMessageNotifications} => ${newGuild.defaultMessageNotifications}`);
            }

            if (oldGuild.discoverySplash !== newGuild.discoverySplash) {
                e.addDescription(`Discovery splash: ${oldGuild.discoverySplashURL({ size: 2048 }) || 'Not set'} => ${newGuild.discoverySplashURL({ size: 2048 }) || 'Unset'}`);
                if (newGuild.discoverySplash) e.setImage(newGuild.discoverySplashURL({ size: 2048 }));
            }

            if (oldGuild.nsfwLevel !== newGuild.nsfwLevel) {
                e.addDescription(`NSFW level: ${oldGuild.nsfwLevel} => ${newGuild.nsfwLevel}`);
            }

            if (oldGuild.splash !== newGuild.splash) {
                const oldSplash = oldGuild.splashURL({ size: 2048 });
                const newSplash = newGuild.splashURL({ size: 2048 });
                e.addDescription(`Splash: ${oldSplash || 'Not set'} => ${newSplash || 'Unset'}`);
                if (newGuild.splash) e.setImage(newGuild.splashURL({ size: 2048 }));
            }

            if (oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
                e.addDescription(`Vanity URL code: ${oldGuild.vanityURLCode || 'Not set'} => ${newGuild.vanityURLCode || 'Unset'}`);
            }

            if (oldGuild.verificationLevel !== newGuild.verificationLevel) {
                e.addDescription(`Verification level: ${oldGuild.verificationLevel} => ${newGuild.verificationLevel}`);
            }

            if (e.description === '' || e.description === null) return null;

            if (guild.members.me.permissions.has('VIEW_AUDIT_LOG', true)) {
                const auditLog = await guild.fetchAuditLogs({ type: 'GUILD_UPDATE', limit: 1 }).then(auditLogs => auditLogs.entries.first());
                if (auditLog.target.id === newGuild.id) e.setFooter({ text: `Moderator: ${auditLog.executor.tag}\nID: ${auditLog.executor.id}` });
            }

            return e;
        }
    },
    inviteCreate: {
        type: 'serverlog',
        color: colors.greenPrimary,
        getEmbed: async function ({ item, guild }) {
            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor({ name: 'Invite link created' })
                .setDescription(`Channel: ${item.channel.toString()}\nURL: ${item.url}`);

            if (guild.members.me.permissions.has('VIEW_AUDIT_LOG', true)) {
                const auditLog = await guild.fetchAuditLogs({ type: 'INVITE_CREATE', limit: 1 }).then(auditLogs => auditLogs.entries.first());
                if (auditLog.target.id === item.id) e.setFooter({ text: `Created by: ${auditLog.executor.tag}\nID: ${auditLog.executor.id}` });
            }

            return e;
        }
    },
    inviteDelete: {
        type: 'serverlog',
        color: colors.redPrimary,
        getEmbed: async function ({ item, guild }) {
            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor({ name: 'Invite link deleted' })
                .setDescription(`Channel: ${item.channel.toString()}\nURL: ${item.url}\nUsed: ${item?.uses || 0} time(s)`);

            if (guild.members.me.permissions.has('VIEW_AUDIT_LOG', true)) {
                const auditLog = await guild.fetchAuditLogs({ type: 'INVITE_DELETE', limit: 1 }).then(auditLogs => auditLogs.entries.first());
                if (auditLog.changes[0].old === item.code) e.setFooter({ text: { text: `Deleted by: ${auditLog.executor.tag}\nID: ${auditLog.executor.id}` } });
            }

            return e;
        }
    },
    messageDelete: {
        type: 'messagelog',
        color: colors.redPrimary,
        getEmbed: function ({ item }) {
            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(item.author.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor({
                    name: 'Message Deleted',
                    iconURL: item.author.displayAvatarURL({ dynamic: true, size: 128 })
                })
                .setDescription(`Author: ${item.author.tag}\nAuthor ID: ${item.author.id}\nChannel: ${item.channel.toString()}\nAttachments: ${item.attachments.size}`)
                .addField('Content ↓', item.content.slice(0, 2000));

            if (item.content.length > 2000) {
                e.addField('Content ↓', item.content.slice(2000, 4000));
            }

            return e;
        }
    },
    messageDeleteBulk: {
        type: 'messagelog',
        color: colors.redPrimary,
        getEmbed: async function ({ item, guild }) {
            const content = item
                .filter(msg => !!msg.content)
                .map(msg => `${item.author.tag}: ${msg.content}`)
                .reverse()
                .join('\n');

            const firstMsg = item.first();

            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor({ name: `Message Bulk Delete (${item.size})` })
                .setDescription(`Channel: ${firstMsg.channel.toString()}`)
                .addField('Content ↓', content.slice(0, 2000) || 'No text messages');

            if (content.length > 2000) {
                e.addField('Content ↓', content.slice(2000, 4000));
            }

            if (guild.members.me.permissions.has('VIEW_AUDIT_LOG', true)) {
                const auditLog = await guild.fetchAuditLogs({ type: 'MESSAGE_BULK_DELETE', limit: 1 }).then(auditLogs => auditLogs.entries.first());
                if (auditLog.target.id === firstMsg.channel.id) e.setFooter({ text: `Deleted by: ${auditLog.executor.tag}\nID: ${auditLog.executor.id}` });
            }

            return e;
        }
    },
    messageUpdate: {
        type: 'messagelog',
        color: colors.bluePrimary,
        getEmbed: function ({ item }) {
            const [oldMessage, newMessage] = item;

            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(newMessage.author.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor({
                    name: 'Message Updated',
                    iconURL: newMessage.author.displayAvatarURL({ dynamic: true, size: 128 })
                })
                .addDescription(`Channel: ${newMessage.channel.toString()}`)
                .addDescription(`[Jump To Message](https://discordapp.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})`);

            e.addField('Content Before ↓', oldMessage.content.slice(0, 2000));
            if (oldMessage.content.length > 2000) e.addField('Content Before ↓', oldMessage.content.slice(2000, 4000));

            e.addField('Content After ↓', newMessage.content.slice(0, 2000));
            if (newMessage.content.length > 2000) e.addField('Content After ↓', newMessage.content.slice(2000, 4000));

            return e;
        }
    },
    roleCreate: {
        type: 'serverlog',
        color: colors.greenPrimary,
        getEmbed: async function ({ item, guild }) {
            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor({ name: 'Role created' })
                .setDescription(`Name: ${item.name}\nRole: ${item.toString()}\nID: ${item.id}\nColor: ${item.hexColor}`)
                .addField('Key Permissions ↓', new Permissions(item.permissions.toArray()).filterKeyPerms().formatToReadable());

            if (item.icon) e.setThumbnail(item.iconURL({ size: 1024 }));

            if (guild.members.me.permissions.has('VIEW_AUDIT_LOG', true)) {
                const auditLog = await guild.fetchAuditLogs({ type: 'ROLE_CREATE', limit: 1 }).then(auditLogs => auditLogs.entries.first());
                if (auditLog.target.id === item.id) e.setFooter({ text: `Moderator: ${auditLog.executor.tag}\nID: ${auditLog.executor.id}` });
            }

            return e;
        }
    },
    roleDelete: {
        type: 'serverlog',
        color: colors.redPrimary,
        getEmbed: async function ({ item, guild }) {
            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor({ name: 'Role deleted' })
                .setDescription(`Name: ${item.name}\nID: ${item.id}\nColor: ${item.hexColor}`)
                .addField('Key Permissions ↓', new Permissions(item.permissions.toArray()).filterKeyPerms().formatToReadable());

            if (item.icon) e.setThumbnail(item.iconURL({ size: 1024 }));

            if (guild.members.me.permissions.has('VIEW_AUDIT_LOG', true)) {
                const auditLog = await guild.fetchAuditLogs({ type: 'ROLE_DELETE', limit: 1 }).then(auditLogs => auditLogs.entries.first());
                if (auditLog.target.id === item.id) e.setFooter({ text: `Moderator: ${auditLog.executor.tag}\nID: ${auditLog.executor.id}` });
            }

            return e;
        }
    },
    roleUpdate: {
        type: 'serverlog',
        color: colors.orangePrimary,
        getEmbed: async function ({ item, guild }) {
            const [oldRole, newRole] = item;

            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor({ name: 'Role updated' });

            const oldPerms = new Permissions(oldRole.permissions).filterKeyPerms().formatToReadable();
            const newPerms = new Permissions(newRole.permissions).filterKeyPerms().formatToReadable();

            if (oldRole.name !== newRole.name) e.addDescription(`Name: ${oldRole.name} => ${newRole.name}`);
            else e.addDescription(`Name: ${newRole.name}`);
            if (oldRole.hexColor !== newRole.hexColor) e.addDescription(`Color: ${oldRole.hexColor} => ${newRole.hexColor}`);
            if (oldRole.hoist !== newRole.hoist) e.addDescription(`Hoist: ${oldRole.hoist} => ${newRole.hoist}`);
            if (oldRole.mentionable !== newRole.mentionable) e.addDescription(`Mentionable: ${oldRole.mentionable} => ${newRole.mentionable}`);
            if (oldPerms !== newPerms) e.addDescription(`**Key Permissions ↓**\n${oldPerms} => ${newPerms}`); // TODO Only show which permissions changed, not all of them

            if (e.description === '' || e.description === null) return null;

            if (guild.members.me.permissions.has('VIEW_AUDIT_LOG', true)) {
                const auditLog = await guild.fetchAuditLogs({ type: 'ROLE_UPDATE', limit: 1 }).then(auditLogs => auditLogs.entries.first());
                if (auditLog.target.id === newRole.id) e.setFooter({ text: `Moderator: ${auditLog.executor.tag}\nID: ${auditLog.executor.id}` });
            }

            return e;
        }
    },
    stickerCreate: {
        type: 'serverlog',
        color: colors.greenPrimary,
        getEmbed: async function ({ item, guild }) {
            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor({ name: 'Sticker Added' })
                .setThumbnail(item.url)
                .setDescription(`Name: ${item.name}\nID: ${item.id}\nDescription: ${item.description}\nTags: ${item?.tags?.join(', ') || 'No tags'}`);

            if (guild.members.me.permissions.has('VIEW_AUDIT_LOG', true)) {
                const auditLog = await guild.fetchAuditLogs({ type: 'STICKER_CREATE', limit: 1 }).then(auditLogs => auditLogs.entries.first());
                if (auditLog.target.id === item.id) e.setFooter({ text: `Moderator: ${auditLog.executor.tag}\nID: ${auditLog.executor.id}` });
            }

            return e;
        }
    },
    stickerDelete: {
        type: 'serverlog',
        color: colors.redPrimary,
        getEmbed: async function ({ item, guild }) {
            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor({ name: 'Sticker Deleted' })
                .setDescription(`Name: ${item.name}\nID: ${item.id}\nDescription: ${item.description}\nTags: ${item?.tags?.join(', ') || 'No tags'}`);

            if (guild.members.me.permissions.has('VIEW_AUDIT_LOG', true)) {
                const auditLog = await guild.fetchAuditLogs({ type: 'STICKER_DELETE', limit: 1 }).then(auditLogs => auditLogs.entries.first());
                if (auditLog.target.id === item.id) e.setFooter({ text: `Moderator: ${auditLog.executor.tag}\nID: ${auditLog.executor.id}` });
            }

            return e;
        }
    },
    stickerUpdate: {
        type: 'serverlog',
        color: colors.orangePrimary,
        getEmbed: async function ({ item, guild }) {
            const [oldSticker, newSticker] = item;

            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor({ name: 'Sticker Updated' })
                .setThumbnail(newSticker.url);

            if (oldSticker.name !== newSticker.name) e.addDescription(`Name: ${oldSticker.name} => ${newSticker.name}`);
            if (oldSticker.description !== newSticker.description) e.addDescription(`Description: ${oldSticker.description} => ${newSticker.description}`);
            if (oldSticker.tags !== newSticker.tags)
                e.addDescription(`Tags: ${oldSticker?.tags?.join(', ') || 'No tags'} => ${newSticker?.tags?.join(', ') || 'No tags'}`);

            if (e.description === '' || e.description === null) return null;

            if (guild.members.me.permissions.has('VIEW_AUDIT_LOG', true)) {
                const auditLog = await guild.fetchAuditLogs({ type: 'STICKER_UPDATE', limit: 1 }).then(auditLogs => auditLogs.entries.first());
                if (auditLog.target.id === item.id) e.setFooter({ text: `Moderator: ${auditLog.executor.tag}\nID: ${auditLog.executor.id}` });
            }

            return e;
        }
    },
    threadCreate: {
        type: 'serverlog',
        color: colors.greenPrimary,
        getEmbed: async function ({ item, guild }) {
            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor({ name: 'Channel Created' })
                .setDescription(`Name: ${item.name}\nID: ${item.id}\nParent: ${item.parent.name}\nType: thread`);

            if (guild.members.me.permissions.has('VIEW_AUDIT_LOG', true)) {
                const auditLog = await guild.fetchAuditLogs({ type: 'THREAD_CREATE', limit: 1 }).then(auditLogs => auditLogs.entries.first());
                if (auditLog.target.id === item.id) e.setFooter({ text: `Moderator: ${auditLog.executor.tag}\nID: ${auditLog.executor.id}` });
            }

            return e;
        }
    },
    threadDelete: {
        type: 'serverlog',
        color: colors.redPrimary,
        getEmbed: async function ({ item, guild }) {
            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor({ name: 'Channel Deleted' })
                .setDescription(`Name: ${item.name}\nID: ${item.id}\nParent: ${item.parent.name}\nType: thread`);

            if (guild.members.me.permissions.has('VIEW_AUDIT_LOG', true)) {
                const auditLog = await guild.fetchAuditLogs({ type: 'THREAD_CREATE', limit: 1 }).then(auditLogs => auditLogs.entries.first());
                if (auditLog.target.id === item.id) e.setFooter({ text: `Deleted by: ${auditLog.executor.tag}\nID: ${auditLog.executor.id}` });
            }

            return e;
        }
    },
    threadUpdate: {
        type: 'serverlog',
        color: colors.orangePrimary,
        getEmbed: async function ({ item, guild }) {
            const [oldThread, newThread] = item;

            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor({ name: 'Channel Updated' });

            if (oldThread.name !== newThread.name)
                e.addDescription(`Name: ${oldThread.name} => ${newThread.name}`);

            if (e.description === '' || e.description === null) return null;

            if (guild.members.me.permissions.has('VIEW_AUDIT_LOG', true)) {
                const auditLog = await guild.fetchAuditLogs({ type: 'THREAD_UPDATE', limit: 1 }).then(auditLogs => auditLogs.entries.first());
                if (auditLog.target.id === newThread.id) e.setFooter({ text: `Moderator: ${auditLog.executor.tag}\nID: ${auditLog.executor.id}` });
            }

            return e;
        }
    },
    filter: {
        type: 'moderationlog',
        color: colors.orangePrimary,
        getEmbed: async function ({ item }) {
            const [member, words] = item;

            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor({
                    name: `${member.user.tag} | Used Filtered Words`,
                    iconURL: member.user.displayAvatarURL({ dynamic: true, size: 128 })
                })
                .addField('User', `ID: ${member.id}`)
                .addField('Words', '||' + words.join(', ') + '||');

            return e;
        }
    },
    invite_link: {
        type: 'moderationlog',
        color: colors.redPrimary,
        getEmbed: async function ({ item }) {
            const [message] = item;

            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor({
                    name: `${message.author.tag} | Sent Invite Link`,
                    iconURL: message.author.displayAvatarURL({ dynamic: true, size: 128 })
                })
                .addField('User', `ID: ${message.member.id}`)
                .addField('Message', message.content);

            return e;
        }
    },
    link: {
        type: 'moderationlog',
        color: colors.redPrimary,
        getEmbed: async function ({ item }) {
            const [message] = item;

            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor({
                    name: `${message.author.tag} | Sent Link`,
                    iconURL: message.author.displayAvatarURL({ dynamic: true, size: 128 })
                })
                .addField('User', `ID: ${message.member.id}`)
                .addField('Message', message.content);

            return e;
        }
    },
    attachment_only: {
        type: 'moderationlog',
        color: colors.orangePrimary,
        getEmbed: async function ({ item }) {
            const [message] = item;

            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor({
                    name: `${message.author.tag} | Sent text in attachment only channel`,
                    iconURL: message.author.displayAvatarURL({ dynamic: true, size: 128 })
                })
                .addField('User', `ID: ${message.member.id}`)
                .addField('Message', message.content);

            return e;
        }
    },
};

/**
 * @description Sends a log message to the corresponding log channel. It has a
 *             set delay so audit logs have time to be created. 
 *             So use with caution because it might make your commands slower.
 * @param {String} action the action that triggered this log
 * @param {GuildObject} Guild object with guild data from the database
 * @param {Discord.Guild} guild 
 * @param {any} item It's an item with information passed to get embed function to use it as it likes
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

    await wait(500); // Wait 500ms for the audit logs to be created

    // call getEmbed to create an embed
    const e = await d.getEmbed({ item, moderator, reason, guild });
    if (!e) return;

    await channel.send({ embeds: [e] }).catch(() => null);
};
