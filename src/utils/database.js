'use strict';

const GuildModel = require('../models/guild');
const UserModel = require('../models/user');

module.exports = {
    guild: {
        async findOneOrCreate(id) {
            let g = await GuildModel.findById(id);
            if (g === null) {
                g = await GuildModel.create({ _id: id });
            }
            return g;
        }
    },
    user: {
        async findOneOrCreate(id) {
            let u = await UserModel.findById(id);
            if (u === null) {
                u = await UserModel.create({ _id: id });
            }
            return u;
        }
    }
};
