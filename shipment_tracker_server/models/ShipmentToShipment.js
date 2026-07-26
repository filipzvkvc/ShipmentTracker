
const { Model, DataTypes } = require('sequelize');
const { SHIPMENT_ATTR, SUB_SHIPMENT_ATTR, MODELS_NAMES } = require('../constants/modelConstants');
const db = require('../config/database');
const Shipment = require('./Shipment');
const SubShipment = require('./SubShipment');


// class ShipmentToShipment extends Model { }

// ShipmentToShipment.init(
//     {
//         // id: {
//         //     type: DataTypes.INTEGER,
//         //     primaryKey: true,
//         //     autoIncrement: true,
//         //     allowNull: false,
//         // },
//         shipmentId: {
//             allowNull: false,
//             autoIncrement: false,
//             primaryKey: true,
//             type: DataTypes.INTEGER
//         },
//         subShipmentId: {
//             allowNull: false,
//             autoIncrement: false,
//             primaryKey: true,
//             type: DataTypes.INTEGER
//         },
//     },
//     {
//         sequelize: db,
//         modelName: MODELS_NAMES.SHIPMENT_TO_SHIPMENT,
//         underscored: false,
//         timestamps: false
//     }
// )
// ShipmentToShipment.init(
//     {
//         shipmentId: {
//             type: DataTypes.INTEGER,
//             references: {
//                 model: Shipment,
//                 key: 'id'
//             }
//         },
//         subShipmentId: {
//             type: DataTypes.INTEGER,
//             references: {
//                 model: SubShipment,
//                 key: 'id'
//             }
//         },
//     },
//     {
//         sequelize: db,
//         modelName: MODELS_NAMES.SHIPMENT_TO_SHIPMENT,
//         underscored: false,
//         timestamps: false
//     }
// )

// Shipment.hasMany(SubShipment, { through: ShipmentToShipment });
// SubShipment.belongsTo(Shipment, { through: ShipmentToShipment });


// ShipmentToShipment.belongsTo(Shipment, {
//     foreignKey: SHIPMENT_ATTR.ID,
//     as: 'shipmentId'
// })
// ShipmentToShipment.belongsTo(SubShipment, {
//     foreignKey: SUB_SHIPMENT_ATTR.ID,
//     as: 'subShipmentId'
// })

// module.exports = ShipmentToShipment;