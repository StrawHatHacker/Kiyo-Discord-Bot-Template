'use strict';

const { and, or } = require('../../../utils/stringManipulation');
const Err = require('../../../classes/Err');

const securityTypes = ['off', 'low', 'medium', 'high'];

module.exports = {
    name: 'setsecurity',
    description: `Set server's set security policy. The bot will automatically handle certain security threats based on the security policy. Type of polices are: ${and(securityTypes, '"')}`,
    aliases: [],
    syntax: `setsecurity <${or(securityTypes, '')}>`,
    requiredPermissions: {
        user: ['ADMINISTRATOR'],
        client: []
    },
    async run({ message, args, Guild }) {
        let securityTypeInput = args[0];
        if (!securityTypeInput) return;

        securityTypeInput = securityTypeInput.toLowerCase();

        if (!securityTypes.includes(securityTypeInput))
            throw new Err(400).inputErr().setMessage(`"Log type" is neither ${or(securityTypes, '"')}`);

        await Guild.updateOne({ security_policy: securityTypeInput });
        Guild.security_policy = securityTypeInput;

        await message.channel.send(`Security policy set to ${securityTypeInput}`);
    }
};
