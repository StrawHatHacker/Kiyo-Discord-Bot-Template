export default {
    regex: {
        url: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&//=]*)/g
    },
    // You dont have to write ADMINISTRATOR for command perms, that gets checked for you
    COMMAND_PERMS: {
        userinfo: {
            user: ['BanMembers', 'KickMembers', 'ManageChannels', 'ManageGuild']
        },
        makeembed: {
            user: ['BanMembers', 'KickMembers', 'ManageChannels', 'ManageGuild']
        },
        mute: {
            user: ['BanMembers', 'KickMembers', 'ManageChannels', 'ManageGuild', 'ManageRoles']
        },
        addmuterole: {
            user: ['BanMembers', 'KickMembers', 'ManageChannels', 'ManageGuild', 'ManageRoles']
        },
        removemuterole: {
            user: ['BanMembers', 'KickMembers', 'ManageChannels', 'ManageGuild', 'ManageRoles']
        },
        removeautorole: {
            user: ['ManageGuild', 'ManageRoles']
        },
        addautorole: {
            user: ['ManageGuild', 'ManageRoles']
        },
        addchatlogignorechannel: {
            user: ['ManageGuild', 'ManageChannels', 'ManageMessages']
        },
        removechatlogignorechannel: {
            user: ['ManageGuild', 'ManageChannels', 'ManageMessages']
        },
        addattachmentonlychannel: {
            user: ['ManageGuild', 'ManageChannels', 'ManageMessages']
        },
        removeattachmentonlychannel: {
            user: ['ManageGuild', 'ManageChannels', 'ManageMessages']
        },
        addlinkfilterchannel: {
            user: ['ManageGuild', 'ManageChannels', 'ManageMessages']
        },
        removelinkfilterchannel: {
            user: ['ManageGuild', 'ManageChannels', 'ManageMessages']
        },
        prune: {
            user: ['BanMembers', 'KickMembers', 'ManageChannels', 'ManageMessages']
        },
        warn: {
            user: ['BanMembers', 'KickMembers', 'ManageChannels', 'ManageGuild', 'ManageRoles']
        },
        addcase: {
            user: ['BanMembers', 'KickMembers', 'ManageChannels', 'ManageGuild', 'ManageRoles', 'ManageMessages']
        },
        removecase: {
            user: ['BanMembers', 'KickMembers', 'ManageChannels', 'ManageGuild', 'ManageRoles', 'ManageMessages']
        },
        editcase: {
            user: ['BanMembers', 'KickMembers', 'ManageChannels', 'ManageGuild', 'ManageRoles', 'ManageMessages']
        },
        cases: {
            user: ['BanMembers', 'KickMembers', 'ManageChannels', 'ManageGuild', 'ManageRoles', 'ManageMessages']
        },
        unban: {
            user: ['BanMembers', 'ManageGuild']
        },
        feature: {
            user: ['ManageGuild']
        },
        addFilter: {
            user: ['ManageGuild']
        },
        removeFilter: {
            user: ['ManageGuild']
        }
    },
    PERM_FLAGS: {
        Administrator: 'Administrator',
        CreateInstantInvite: 'Create Invite',
        KickMembers: 'Kick Members',
        BanMembers: 'Ban Members',
        ManageChannels: 'Manage Channels',
        ManageGuild: 'Manage Server',
        AddReactions: 'Add Reactions',
        ViewAuditLog: 'View Audit Log',
        PrioritySpeaker: 'Priority Speaker',
        Stream: 'Stream',
        SendMessages: 'Send Messages',
        SendTTSMessages: 'Send TTS Messages',
        ManageMessages: 'Manage Messages',
        EmbedLinks: 'Embed Links',
        AttachFiles: 'Attach Files',
        ReadMessageHistory: 'Read Message History',
        MentionEveryone: 'Mention Everyone',
        UseExternalEmojis: 'Use External Emojis',
        ViewGuildInsights: 'View Server Insights',
        Connect: 'Connect',
        Speak: 'Speak',
        ViewChannel: 'View Channel',
        MuteMembers: 'Mute Members',
        DeafenMembers: 'Deafen Members',
        MoveMembers: 'Move Members',
        UseVAD: 'Use Voice Activity Detection',
        ChangeNickname: 'Change Nickname',
        ManageNicknames: 'Manage Nicknames',
        ManageRoles: 'Manage Roles',
        ManageWebhooks: 'Manage Webhooks',
        ManageEmojis: 'Manage Emojis',
        UseApplicationCommands: 'Use Application Commands',
        RequestToSpeak: 'Request to Speak',
        UsePublicThreads: 'Use Public Threads',
        CreatePublicThreads: 'Create Public Threads',
        UsePrivateThreads: 'Use Private Threads',
        CreatePrivateThreads: 'Create Private Threads',
        UseExternalStickers: 'Use External Stickers',
        SendMessagesInThreads: 'Send Messages in Threads',
        StartEmbeddedActivities: 'Start Embedded Activities',
    },
    USER_FLAGS: {
        DISCORD_EMPLOYEE: 'Discord Employee',
        PARTNERED_SERVER_OWNER: 'Partnered Server Owner',
        HYPESQUAD_EVENTS: 'HypeSquad Events',
        BUGHUNTER_LEVEL_1: 'Bug Hunter Level 1',
        BUGHUNTER_LEVEL_2: 'Bug Hunter Level 2',
        HOUSE_BRAVERY: 'HypeSquad Bravery',
        HOUSE_BRILLIANCE: 'HypeSquad Brilliance',
        HOUSE_BALANCE: 'HypeSquad Balance',
        EARLY_SUPPORTER: 'Early Supporter',
        TEAM_USER: 'Team User',
        VERIFIED_BOT: 'Verified Bot',
        EARLY_VERIFIED_BOT_DEVELOPER: 'Early Verified Bot Developer',
        DISCORD_CERTIFIED_MODERATOR: 'Discord Certified Moderator',
    },
    CHANNEL_TYPES: {
        GUILD_TEXT: 'Text',
        DM: 'DM',
        GUILD_VOICE: 'Voice',
        GROUP_DM: 'Group DM',
        GUILD_CATEGORY: 'Category',
        GUILD_NEWS: 'News',
        GUILD_STORE: 'Store',
        GUILD_NEWS_THREAD: 'News Thread',
        GUILD_PUBLIC_THREAD: 'Public Thread',
        GUILD_PRIVATE_THREAD: 'Private Thread',
        GUILD_STAGE_VOICE: 'Stage Voice',
        UNKNOWN: 'Unknown',
    },
    KEY_PERMS: [
        'Administrator',
        'CreateInstantInvite',
        'KickMembers',
        'BanMembers',
        'ManageChannels',
        'ManageGuild',
        'ViewAuditLog',
        'ManageMessages',
        'MentionEveryone',
        'ViewGuildInsights',
        'MuteMembers',
        'DeafenMembers',
        'MoveMembers',
        'ManageNicknames',
        'ManageRoles',
        'ManageWebhooks',
        'ManageEmojis',
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
    ],
    colors: {
        redPrimary: 0xe83036,
        redSecondary: 0xf25050,
        orangePrimary: 0xeb8714,
        yellowPrimary: 0xffc107,
        bluePrimary: 0x3b77d8,
        greenPrimary: 0x6DD943
    }
};
