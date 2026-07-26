const { Model, DataTypes, Sequelize } = require('sequelize');
const { ITEM_TYPE_ATTR, MODELS_NAMES } = require('../constants/modelConstants');
const db = require('../config/database');
class ItemType extends Model {}
ItemType.init(
    {
        [ITEM_TYPE_ATTR.ID]: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        [ITEM_TYPE_ATTR.NAME]: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true,
        },
        [ITEM_TYPE_ATTR.NUMBER_OF_SOLD_ITEMS]: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

    }, {
    sequelize: db,
    modelName: MODELS_NAMES.ITEM_TYPE,
    underscored: false,
     paranoid: true,
})
module.exports = ItemType;