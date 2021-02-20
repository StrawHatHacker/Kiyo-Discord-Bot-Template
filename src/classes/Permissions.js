const PERM_FLAGS = {
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
}

module.exports = class Permissions {
    constructor(perms) {
        this.perms = perms;
    };

    formatPerms() {
        let _ = new Set();

        for (const p of this.perms) {
            if (p === 'ADMINISTRATOR') return 'Administrator';
            _.add(PERM_FLAGS[p]);
        };

        return Array.from(_).join(', ');
    };
};