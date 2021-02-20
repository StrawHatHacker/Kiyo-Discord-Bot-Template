module.exports = (Kiyo, message) => {
    if (message.author.bot || message.channel.type === 'dm') return;
    if (!message.content.toLowerCase().startsWith(Kiyo.globalPrefix)) return;

    const [cmd, ...args] = message.content
        .toLowerCase()
        .slice(Kiyo.globalPrefix.length)
        .split(/\s+/g);

    for (const [commandName, command] of Kiyo.commands) {
        if (commandName !== cmd) continue;

        command.run({ message, Kiyo, args });
    };
};