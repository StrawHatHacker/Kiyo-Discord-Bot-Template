'use strict';

module.exports = {
    guild: {
        async findOneOrCreate(GuildModel, [id]) {
            let g = await GuildModel.findById(id);
            if (g === null) {
                g = await GuildModel.create({
                    _id: id
                });
            }
            return g;
        },
    },
};