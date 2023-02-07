'use strict';

const GuildModel = require('../models/guild');
const UserModel = require('../models/user');

module.exports = {
    guild: {
        async findOneOrCreate(id, cache) {
            const cachedGuild = cache.get(id);
            if (cachedGuild) return cachedGuild;

            let g = await GuildModel.findById(id);

            if (!g) g = await GuildModel.create({ _id: id });

            cache.set(g._id, g);

            return g;
        }
    },
    user: {
        async findOneOrCreate(id) {
            let u = await UserModel.findById(id);

            if (!u) u = await UserModel.create({ _id: id });

            return u;
        }
    }
};
