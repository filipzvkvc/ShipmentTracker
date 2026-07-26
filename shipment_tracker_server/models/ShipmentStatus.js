const { Model, DataTypes } = require('sequelize');
const { SHIPMENT_STATUS_ATTR, MODELS_NAMES } = require('../constants/modelConstants');
const db = require('../config/database');
class ShipmentStatus extends Model { }
ShipmentStatus.init(
    {
        [SHIPMENT_STATUS_ATTR.ID]: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        [SHIPMENT_STATUS_ATTR.STATUS]: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize: db,
        modelName: MODELS_NAMES.SHIPMENT_STATUS,
        underscored: false,
        paranoid: true,
        createdAt: false,
        updatedAt:false
    }
)
module.exports = ShipmentStatus;
