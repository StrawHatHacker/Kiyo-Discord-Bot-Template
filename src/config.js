module.exports = {
    // You dont have to write ADMINISTRATOR for command perms, that gets checked for you
    COMMAND_PERMS: {
        userinfo: {
            user: ['BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_GUILD']
        },
        makeembed: {
            user: ['BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_GUILD']
        },
        mute: {
            user: ['BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'MANAGE_ROLES']
        },
        addmuterole: {
            user: ['BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'MANAGE_ROLES']
        },
        removemuterole: {
            user: ['BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'MANAGE_ROLES']
        },
        prune: {
            user: ['BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES']
        },
        warn: {
            user: ['BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'MANAGE_ROLES']
        },
        addcase: {
            user: ['BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'MANAGE_ROLES', 'MANAGE_MESSAGES']
        },
        removecase: {
            user: ['BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'MANAGE_ROLES', 'MANAGE_MESSAGES']
        },
        editcase: {
            user: ['BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'MANAGE_ROLES', 'MANAGE_MESSAGES']
        },
        cases: {
            user: ['BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'MANAGE_ROLES', 'MANAGE_MESSAGES']
        },
        unban: {
            user: ['BAN_MEMBERS', 'MANAGE_GUILD']
        },
        feature: {
            user: ['MANAGE_GUILD']
        }
    },
    PERM_FLAGS: {
        ADMINISTRATOR: 'Administrator',
        CREATE_INSTANT_INVITE: 'Create Invite',
        KICK_MEMBERS: 'Kick Members',
        BAN_MEMBERS: 'Ban Members',
        MANAGE_CHANNELS: 'Manage Channels',
        MANAGE_GUILD: 'Manage Server',
        ADD_REACTIONS: 'Add Reactions',
        VIEW_AUDIT_LOG: 'View Audit Log',
        PRIORITY_SPEAKER: 'Priority Speaker',
        STREAM: 'Stream',
        SEND_MESSAGES: 'Send Messages',
        SEND_TTS_MESSAGES: 'Send TTS Messages',
        MANAGE_MESSAGES: 'Manage Messages',
        EMBED_LINKS: 'Embed Links',
        ATTACH_FILES: 'Attach Files',
        READ_MESSAGE_HISTORY: 'Read Message History',
        MENTION_EVERYONE: 'Mention Everyone',
        USE_EXTERNAL_EMOJIS: 'Use External Emojis',
        VIEW_GUILD_INSIGHTS: 'View Server Insights',
        CONNECT: 'Connect',
        SPEAK: 'Speak',
        VIEW_CHANNEL: 'View Channel',
        MUTE_MEMBERS: 'Mute Members',
        DEAFEN_MEMBERS: 'Deafen Members',
        MOVE_MEMBERS: 'Move Members',
        USE_VAD: 'Use Voice Activity Detection',
        CHANGE_NICKNAME: 'Change Nickname',
        MANAGE_NICKNAMES: 'Manage Nicknames',
        MANAGE_ROLES: 'Manage Roles',
        MANAGE_WEBHOOKS: 'Manage Webhooks',
        MANAGE_EMOJIS: 'Manage Emojis',
    },
    KEY_PERMS: [
        'ADMINISTRATOR',
        'CREATE_INSTANT_INVITE',
        'KICK_MEMBERS',
        'BAN_MEMBERS',
        'MANAGE_CHANNELS',
        'MANAGE_GUILD',
        'VIEW_AUDIT_LOG',
        'MANAGE_MESSAGES',
        'MENTION_EVERYONE',
        'VIEW_GUILD_INSIGHTS',
        'MUTE_MEMBERS',
        'DEAFEN_MEMBERS',
        'MOVE_MEMBERS',
        'MANAGE_NICKNAMES',
        'MANAGE_ROLES',
        'MANAGE_WEBHOOKS',
        'MANAGE_EMOJIS',
    ],
    MONTHS: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]
};
