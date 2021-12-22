'use strict';

const { prettifyUserFlags, prettifyChannelTypeFlags } = require('../utils/prettifyFlags');
const DateFormatter = require('../utils/DateFormatter');
const Permissions = require('../classes/Permissions');
const prettifyRoles = require('./prettifyRoles');
const Embed = require('../classes/Embed');
const { colors } = require('../config');

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
                .setAuthor(`${memberToWarn.user.tag} got ${this.userGot}`,
                    memberToWarn.user.displayAvatarURL({ dynamic: true, size: 128 }))
                .addField(`${this.userGot} user`, `ID: ${memberToWarn.id}\n${rolesString ? `Roles: ${rolesString}` : ''}`)
                .addField('Moderator', `${moderator.user.tag}\n${moderator.id}`)
                .addField('Reason', `${reason.slice(0, 1024)}`)
                .setFooter(`Case #${NewCase.case}`);
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
                .setAuthor(`${memberToKick.user.tag} got ${this.userGot}`,
                    memberToKick.user.displayAvatarURL({ dynamic: true, size: 128 }))
                .addField(`${this.userGot} user`, `ID: ${memberToKick.id}\n${rolesString ? `Roles: ${rolesString}` : ''}`)
                .addField('Moderator', `${moderator.user.tag}\n${moderator.id}`)
                .addField('Reason', `${reason.slice(0, 1024)}`)
                .setFooter(`Case #${NewCase.case}`);
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
                .setAuthor(`${memberToBan.user.tag} got ${this.userGot}`,
                    memberToBan.user.displayAvatarURL({ dynamic: true, size: 128 }))
                .addField(`${this.userGot} user`, `ID: ${memberToBan.id}\n${rolesString ? `Roles: ${rolesString}` : ''}`)
                .addField('Moderator', `${moderator.user.tag}\n${moderator.id}`)
                .addField('Reason', `${reason.slice(0, 1024)}`)
                .setFooter(`Case #${NewCase.case}`);
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
                .setAuthor(`${memberToMute.user.tag} got ${this.userGot}`,
                    memberToMute.user.displayAvatarURL({ dynamic: true, size: 128 }))
                .addField(`${this.userGot} user`, `ID: ${memberToMute.id}`)
                .addField('Moderator', `${moderator.user.tag}\n${moderator.id}`)
                .addField('Reason', `${reason.slice(0, 1024)}`)
                .setFooter(`Case #${NewCase.case}`);
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
                .setAuthor(`${memberToBan.user.tag} got ${this.userGot}`,
                    memberToBan.user.displayAvatarURL({ dynamic: true, size: 128 }))
                .addField(`${this.userGot} user`, `ID: ${memberToBan.id}\n${rolesString ? `Roles: ${rolesString}` : ''}`)
                .addField('Moderator', `${moderator.user.tag}\n${moderator.id}`)
                .addField('Reason', `${reason.slice(0, 1024)}`)
                .setFooter(`Case #${NewCase.case}`);
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
                .setAuthor(`${item.tag} got ${this.userGot}`,
                    item.displayAvatarURL({ dynamic: true, size: 128 }))
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
                .setAuthor(`${item.user.tag} got ${this.userGot}`,
                    item.user.displayAvatarURL({ dynamic: true, size: 128 }))
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
                .setAuthor(`${item.user.tag} Joined`,
                    item.user.displayAvatarURL({ dynamic: true, size: 128 }))
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
                .setAuthor(`${item.user.tag} Left`,
                    item.user.displayAvatarURL({ dynamic: true, size: 128 }))
                .addField('User', `ID: ${item.id}\nCreated at ${new DateFormatter(item.user.createdAt).formatToReadable()}${rolesString ? `\nRoles: ${rolesString}` : ''}`);

            if (item.user.flags.toArray().length > 0) e.addField('Flags', prettifyUserFlags(item.user.flags.toArray()).join('\n'));

            return e;
        }
    },
    channelCreate: {
        type: 'serverlog',
        color: colors.greenPrimary,
        getEmbed: function ({ item }) {
            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor('Channel Created')
                .setDescription(`Name: ${item.name}\nID: ${item.id}${item.parent?.name ? `\nCategory: ${item.parent.name}` : ''}\nType: ${prettifyChannelTypeFlags(item.type)}`);
        }
    },
    channelDelete: {
        type: 'serverlog',
        color: colors.redPrimary,
        getEmbed: function ({ item }) {
            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor('Channel Deleted')
                .setDescription(`Name: ${item.name}\nID: ${item.id}${item.parent?.name ? `\nCategory: ${item.parent.name}` : ''}\nType: ${prettifyChannelTypeFlags(item.type)}`);
        }
    },
    channelUpdate: {
        type: 'serverlog',
        color: colors.orangePrimary,
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
                e.addDescription(`Type: ${prettifyChannelTypeFlags(oldChannel.type)} => ${prettifyChannelTypeFlags(newChannel.type)}`);

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

            if (e.description === '' || e.description === null) return null;
            return e;
        }
    },
    emojiCreate: {
        type: 'serverlog',
        color: colors.greenPrimary,
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
        color: colors.redPrimary,
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
        color: colors.orangePrimary,
        getEmbed: function ({ item }) {
            const [oldEmoji, newEmoji] = item;

            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor('Emoji Updated')
                .setThumbnail(newEmoji.url)
                .setDescription(`Name: ${oldEmoji.name} => ${newEmoji.name}\nID: ${newEmoji.id}`);
        }
    },
    guildBanAdd: {
        type: 'serverlog',
        color: colors.redSecondary,
        getEmbed: function ({ item }) {
            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(item.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor(`${item.user.tag} got banned`,
                    item.user.displayAvatarURL({ dynamic: true, size: 128 }))
                .addField('Banned user', `ID: ${item.user.id}`)
                .addField('Reason', `${item.reason?.slice(0, 1024) || 'No reason provided'}`);
        }
    },
    guildBanRemove: {
        type: 'serverlog',
        color: colors.orangePrimary,
        getEmbed: function ({ item }) {
            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(item.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor(`${item.user.tag} got unbanned`,
                    item.user.displayAvatarURL({ dynamic: true, size: 128 }))
                .addField('Unbanned user', `ID: ${item.user.id}`);
        }
    },
    guildUpdate: {
        type: 'serverlog',
        color: colors.orangePrimary,
        getEmbed: function ({ item }) {
            const [oldGuild, newGuild] = item;

            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setThumbnail(newGuild.iconURL({ dynamic: true, size: 2048 }))
                .setAuthor('Server Update', newGuild.iconURL({ dynamic: true, size: 128 }));

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

            if (oldGuild.premiumTier !== newGuild.premiumTier) {
                e.addDescription(`Premium tier: ${oldGuild.premiumTier} => ${newGuild.premiumTier}`);
            }

            if (oldGuild.premiumSubscriptionCount !== newGuild.premiumSubscriptionCount) {
                e.addDescription(`Boosts: ${oldGuild.premiumSubscriptionCount} => ${newGuild.premiumSubscriptionCount}`);
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
            return e;
        }
    },
    inviteCreate: {
        type: 'serverlog',
        color: colors.greenPrimary,
        getEmbed: function ({ item }) {
            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor('Invite link created')
                .setDescription(`Channel: ${item.channel.toString()}\nURL: ${item.url}`);
        }
    },
    inviteDelete: {
        type: 'serverlog',
        color: colors.redPrimary,
        getEmbed: function ({ item }) {
            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor('Invite link deleted')
                .setDescription(`Channel: ${item.channel.toString()}\nURL: ${item.url}`);
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
                .setAuthor('Message Deleted',
                    item.author.displayAvatarURL({ dynamic: true, size: 128 }))
                .setDescription(`Author: ${item.member.displayName}\nAuthor ID: ${item.author.id}\nChannel: ${item.channel.toString()}\nAttachments: ${item.attachments.size}`)
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
            const content = item
                .filter(msg => !!msg.content)
                .map(msg => `${msg.member.displayName}: ${msg.content}`)
                .reverse()
                .join('\n');

            const firstMsg = item.first();

            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor(`Message Bulk Delete (${item.size})`)
                .setDescription(`Channel: ${firstMsg.channel.toString()}`)
                .addField('Content ↓', content.slice(0, 2000) || 'No text messages');

            if (content.length > 2000) {
                e.addField('Content ↓', content.slice(2000, 4000));
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
                .setAuthor('Message Updated',
                    newMessage.author.displayAvatarURL({ dynamic: true, size: 128 }))
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
        getEmbed: function ({ item }) {
            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor('Role created')
                .setDescription(`Name: ${item.name}\nRole: ${item.toString()}\nID: ${item.id}\nColor: ${item.hexColor}`)
                .addField('Key Permissions ↓', new Permissions(item.permissions.toArray()).filterKeyPerms().formatToReadable());

            if (item.icon) e.setThumbnail(item.iconURL({ size: 1024 }));

            return e;
        }
    },
    roleDelete: {
        type: 'serverlog',
        color: colors.redPrimary,
        getEmbed: function ({ item }) {
            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor('Role deleted')
                .setDescription(`Name: ${item.name}\nID: ${item.id}\nColor: ${item.hexColor}`)
                .addField('Key Permissions ↓', new Permissions(item.permissions.toArray()).filterKeyPerms().formatToReadable());

            if (item.icon) e.setThumbnail(item.iconURL({ size: 1024 }));

            return e;
        }
    },
    roleUpdate: {
        type: 'serverlog',
        color: colors.orangePrimary,
        getEmbed: function ({ item }) {
            const [oldRole, newRole] = item;

            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor('Role update');

            const oldPerms = new Permissions(oldRole.permissions).filterKeyPerms().formatToReadable();
            const newPerms = new Permissions(newRole.permissions).filterKeyPerms().formatToReadable();

            if (oldRole.name !== newRole.name) e.addDescription(`Name: ${oldRole.name} => ${newRole.name}`);
            else e.addDescription(`Name: ${newRole.name}`);
            if (oldRole.hexColor !== newRole.hexColor) e.addDescription(`Color: ${oldRole.hexColor} => ${newRole.hexColor}`);
            if (oldRole.hoist !== newRole.hoist) e.addDescription(`Hoist: ${oldRole.hoist} => ${newRole.hoist}`);
            if (oldRole.mentionable !== newRole.mentionable) e.addDescription(`Mentionable: ${oldRole.mentionable} => ${newRole.mentionable}`);
            if (oldPerms !== newPerms) e.addDescription(`**Key Permissions ↓**\n${oldPerms} => ${newPerms}`); // TODO Only show which permissions changed, not all of them

            if (e.description === '' || e.description === null) return null;
            return e;
        }
    },
    stickerCreate: {
        type: 'serverlog',
        color: colors.greenPrimary,
        getEmbed: function ({ item }) {
            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor('Sticker Added')
                .setThumbnail(item.url)
                .setDescription(`Name: ${item.name}\nID: ${item.id}\nDescription: ${item.description}\nTags: ${item?.tags?.join(', ') || 'No tags'}`);
        }
    },
    stickerDelete: {
        type: 'serverlog',
        color: colors.redPrimary,
        getEmbed: function ({ item }) {
            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor('Sticker Deleted')
                .setDescription(`Name: ${item.name}\nID: ${item.id}\nDescription: ${item.description}\nTags: ${item?.tags?.join(', ') || 'No tags'}`);
        }
    },
    stickerUpdate: {
        type: 'serverlog',
        color: colors.orangePrimary,
        getEmbed: function ({ item }) {
            const [oldSticker, newSticker] = item;

            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor('Sticker Updated')
                .setThumbnail(newSticker.url);

            if (oldSticker.name !== newSticker.name) e.addDescription(`Name: ${oldSticker.name} => ${newSticker.name}`);
            if (oldSticker.description !== newSticker.description) e.addDescription(`Description: ${oldSticker.description} => ${newSticker.description}`);
            if (oldSticker.tags !== newSticker.tags)
                e.addDescription(`Tags: ${oldSticker?.tags?.join(', ') || 'No tags'} => ${newSticker?.tags?.join(', ') || 'No tags'}`);

            if (e.description === '' || e.description === null) return null;

            return e;
        }
    },
    threadCreate: {
        type: 'serverlog',
        color: colors.greenPrimary,
        getEmbed: function ({ item }) {
            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor('Channel Created')
                .setDescription(`Name: ${item.name}\nID: ${item.id}\nParent: ${item.parent.name}\nType: thread`);
        }
    },
    threadDelete: {
        type: 'serverlog',
        color: colors.redPrimary,
        getEmbed: function ({ item }) {
            return new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor('Channel Deleted')
                .setDescription(`Name: ${item.name}\nID: ${item.id}\nParent: ${item.parent.name}\nType: thread`);
        }
    },
    threadUpdate: {
        type: 'serverlog',
        color: colors.orangePrimary,
        getEmbed: function ({ item }) {
            const [oldThread, newThread] = item;

            const e = new Embed()
                .setTimestamp()
                .setColor(this.color)
                .setAuthor('Channel Updated');

            if (newThread.name !== newThread.name)
                e.addDescription(`Name: ${oldThread.name} => ${newThread.name}`);

            if (e.description === '' || e.description === null) return null;
            return e;
        }
    },
};

/**
 * @description Sends a log message to the corresponding log channel
 * @param {warn|kick|ban|softban|mute|unban|unmute} action the action that triggered this log
 * @param {GuildObject} Guild object with guild data from the database
 * @param {Discord.Guild} guild 
 * @param {} item It's an item with information passed to get embed function to use it as it likes
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
    if (!e) return;

    await channel.send({ embeds: [e] });
};
