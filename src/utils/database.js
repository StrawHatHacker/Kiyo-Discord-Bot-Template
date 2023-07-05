'use strict';

module.exports = {
    guild: {
        async findOneOrCreate(id, db) {

            let g = await db.models.Guild.findById(id);

            if (!g) g = await db.models.Guild.create({ id: id });

            return g;
        }
    },
    user: {
        async findOneOrCreate(id, db) {

            let u = await db.models.User.findById(id);

            if (!u) u = await db.models.User.create({ id: id });

            return u;
        }
    }
};
