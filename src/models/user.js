'use strict';

const { DataTypes } = require('sequelize');

module.exports = (db) => {
    db.define('User', {
        id: {
            type: DataTypes.STRING,
            unique: true,
            primaryKey: true,
            allowNull: false,
        },
    }, {});

    /**
     * @param {string|number} id 
     */
    db.models.User.findById = async (id) => {

        let users = await db.models.User.findAll({
            where: {
                id: id
            }
        });

        if (users.length === 0 || !users) return null;

        return users[0];
    };
};