const { Model, DataTypes } = require('sequelize');
const { CARGO_TO_ITEM_TYPE_ATTR, MODELS_NAMES } = require('../constants/modelConstants');
const db = require('../config/database');
const ItemType = require('./ItemType');
const Cargo = require('./Cargo');
class CargoToItemType extends Model { }
CargoToItemType.init(
    {
        [CARGO_TO_ITEM_TYPE_ATTR.ID]: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        [CARGO_TO_ITEM_TYPE_ATTR.DESCRIPTION]: {
            type: DataTypes.STRING
        },
    },
    {
        sequelize: db,
        modelName: MODELS_NAMES.CARGO_TO_ITEM_TYPE,
        underscored: false,
        paranoid: true,
        createdAt: false,
        updatedAt: false
    }
)
CargoToItemType.belongsTo(Cargo, {
    foreignKey: 'cargo_id',
    as: 'cargo'
})
CargoToItemType.belongsTo(ItemType, {
    foreignKey: 'item_type_id',
    as: 'itemType'
})
module.exports = CargoToItemType;
