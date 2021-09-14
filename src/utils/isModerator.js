module.exports = (member) => {
    return member.permissions.has('MANAGE_MESSAGES') ||
        member.permissions.has('MANAGE_CHANNELS') ||
        member.permissions.has('VIEW_AUDIT_LOG') ||
        member.permissions.has('ADMINISTRATOR') ||
        member.permissions.has('KICK_MEMBERS') ||
        member.permissions.has('MANAGE_GUILD') ||
        member.permissions.has('BAN_MEMBERS') || false;
};
