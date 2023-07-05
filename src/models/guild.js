'use strict';

const { DataTypes } = require('sequelize');

module.exports = (db) => {
    db.define('Guild', {
        id: {
            type: DataTypes.STRING,
            unique: true,
            primaryKey: true,
            allowNull: false,
        },
        prefix: {
            type: DataTypes.STRING,
            defaultValue: '>'
        },
    }, {});

    /**
     * @param {string|number} id 
     */
    db.models.Guild.findById = async (id) => {

        const guilds = await db.models.Guild.findAll({
            where: {
                id: id
            }
        });

        if (guilds.length === 0 || !guilds) return null;

        return guilds[0];
    };
};