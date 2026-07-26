const { Model, DataTypes } = require('sequelize');
const { SHIPMENT_ATTR, MODELS_NAMES } = require('../constants/modelConstants');
const db = require('../config/database');
const User = require('./User');
const Country = require('./Country');
const ShipmentStatus = require('./ShipmentStatus');
// const SubShipment = require('./SubShipment');


class Shipment extends Model { }

Shipment.init(
    {
        [SHIPMENT_ATTR.ID]: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        [SHIPMENT_ATTR.DEPARTURE_DATE]: {
            type: DataTypes.DATE,
            allowNull: false
        },
        [SHIPMENT_ATTR.ARRIVAL_DATE]: {
            type: DataTypes.DATE,
            allowNull: false
        },
        [SHIPMENT_ATTR.ARRIVAL_PLACE]: {
            type: DataTypes.STRING,
            allowNull: false
        },
        [SHIPMENT_ATTR.RETURNING_DATE]: {
            type: DataTypes.DATE,
            allowNull: false
        },
        [SHIPMENT_ATTR.RETURNING_PLACE]: {
            type: DataTypes.STRING,
            allowNull: false
        },
        [SHIPMENT_ATTR.CARGO_TICKET_PRICE]: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        [SHIPMENT_ATTR.TICKET_PRICE]: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        [SHIPMENT_ATTR.COMMENT]: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        sequelize: db,
        modelName: MODELS_NAMES.SHIPMENT,
        underscored: false,
        paranoid: true,
    }
)
Shipment.belongsTo(User, {
    foreignKey: 'employee_id',
    as: 'employee',
})
Shipment.belongsTo(ShipmentStatus, {
    foreignKey: 'shipment_status_id',
    as: 'shipmentStatus'
})
Shipment.belongsTo(Country, {
    foreignKey: 'country_id',
    as: 'country'
})


module.exports = Shipment;