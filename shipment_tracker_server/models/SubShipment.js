const { Model, DataTypes } = require('sequelize');
const {
  SUB_SHIPMENT_ATTR,
  MODELS_NAMES,
  SHIPMENT_ATTR,
} = require('../constants/modelConstants');
const db = require('../config/database');
const CargoToItemType = require('./CargoToItemType');
const User = require('./User');
const Shipment = require('./Shipment');
const SubShipmentStatus = require('./SubShipmentStatus');
class SubShipment extends Model {}
SubShipment.init(
  {
    [SUB_SHIPMENT_ATTR.ID]: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    [SUB_SHIPMENT_ATTR.SUB_SHIPMENT_PLACE]: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    [SUB_SHIPMENT_ATTR.DELIVERY_DATE]: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    [SUB_SHIPMENT_ATTR.COMMENT]: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    [SUB_SHIPMENT_ATTR.PROOF]: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: MODELS_NAMES.SUB_SHIPMENT,
    underscored: false,
    paranoid: true,
  }
);
SubShipment.belongsTo(Shipment, {
  foreignKey: 'shipment_id',
  as: 'shipment',
});
SubShipment.belongsTo(CargoToItemType, {
  foreignKey: 'cargoToItemType_id',
  as: 'cargoToItemType',
});
SubShipment.belongsTo(User, {
  foreignKey: 'employee_id',
  as: 'employee',
});
SubShipment.belongsTo(User, {
  foreignKey: 'client_id',
  as: 'client',
});
SubShipment.belongsTo(SubShipmentStatus, {
  foreignKey: 'sub_shipment_status_id',
  as: 'subShipmentStatus',
});
module.exports = SubShipment;
