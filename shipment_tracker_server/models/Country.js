const { Model, DataTypes, Sequelize } = require('sequelize');
const { COUNTRY_ATTR, MODELS_NAMES } = require('../constants/modelConstants');
const db = require('../config/database');

class Country extends Model { }

Country.init(
    {
        [COUNTRY_ATTR.ID]: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        [COUNTRY_ATTR.NAME]: {
            type: DataTypes.STRING,
            allowNull: false,
        },

    }, {
    sequelize: db,
    modelName: MODELS_NAMES.COUNTRY,
    underscored: false,
    paranoid: true,
})
module.exports = Country;