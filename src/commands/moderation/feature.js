'use strict';

const { and, or } = require('../../utils/stringManipulation');
const { COMMAND_PERMS } = require('../../config');
const Err = require('../../classes/Err');

const featureTypes = ['welcomemessages', 'moderationlog', 'messagelog', 'serverlog', 'memberlog'];

module.exports = {
    name: 'feature',
    description: `Toggle on or off a certain bot feature. Features include: ${and(featureTypes, '"')}. Toggle can be: "on" or "off"`,
    aliases: [],
    syntax: 'feature <feature> <toggle>',
    requiredPermissions: {
        user: COMMAND_PERMS.feature.user,
        client: []
    },
    async run({ message, args, Guild }) {
        let featureInput = args[0];
        let toggleInput = args[1];
        if (!featureInput || !toggleInput) return;

        featureInput = featureInput.toLowerCase();

        if (!featureTypes.includes(featureInput))
            throw new Err(400).inputErr().setMessage(`"Feature" is neither ${or(featureTypes, '"')}`);
        if (!['on', 'off'].includes(toggleInput))
            throw new Err(400).inputErr().setMessage('"Toggle" is neither "on" or "off"');

        let bool, str;

        if (toggleInput === 'on') {
            bool = true;
            str = 'on';
        }
        else {
            bool = false;
            str = 'off';
        }

        await Guild.updateOne({ [`features.${featureInput}`]: bool });
        await message.channel.send(`Feature "${featureInput}" has been toggled ${str}`);
    }
};
