const sequelize = require('sequelize');
const Op = sequelize.Op;
const Shipment = require('../models/Shipment');
const SubShipment = require('../models/SubShipment');
const ShipmentStatus = require('../models/ShipmentStatus');
const SubShipmentStatus = require('../models/SubShipmentStatus');
const User = require('../models/User');
const Country = require('../models/Country');
const CargoToItemType = require('../models/CargoToItemType');
const Cargo = require('../models/Cargo');
const ItemType = require('../models/ItemType');
const factory = require('./handlerFactoryController');
const ShipmentIncdules = {
  include: [
    { model: User, as: 'employee' },
    { model: ShipmentStatus, as: 'shipmentStatus' },
    { model: Country, as: 'country' },
  ],
  order: [['id', 'ASC']],
  attributes: { exclude: ['employee_id', 'shipment_status_id', 'country_id'] },
};

async function getShipments(req, res, next) {
  try {
    const shipmentsView = [];
    const where = {};
    if (req.query.employee_id) where.employee_id = req.query.employee_id;

    const response = await Shipment.findAll({ ...ShipmentIncdules, where });

    for (let s of response) {
      const numberOfSubShipments = await SubShipment.count({
        where: [{ shipment_id: s.id }],
      });

      s.dataValues['numOfSubs'] = numberOfSubShipments;
      shipmentsView.push(s);
    }

    return res.status(200).json(shipmentsView);
  } catch (error) {
    next(error);
  }
}

async function updateShipment(req, res, next) {
  try {
    await Shipment.update(req.body, { where: { id: req.params.id } });

    if (req.body.shipment_status_id) {
      const newStatus = await ShipmentStatus.findByPk(req.body.shipment_status_id);
      if (newStatus?.status === 'DELIVERED') {
        const deliveredSubStatus = await SubShipmentStatus.findOne({ where: { status: 'DELIVERED' } });
        if (deliveredSubStatus) {
          const canceledSubStatus = await SubShipmentStatus.findOne({ where: { status: 'CANCELED' } });
          const excludeIds = [deliveredSubStatus.id];
          if (canceledSubStatus) excludeIds.push(canceledSubStatus.id);

          await SubShipment.update(
            { sub_shipment_status_id: deliveredSubStatus.id, deliveryDate: new Date() },
            {
              where: {
                shipment_id: req.params.id,
                sub_shipment_status_id: { [Op.notIn]: excludeIds },
              },
            }
          );
        }
      }
    }

    const result = await Shipment.findByPk(req.params.id, ShipmentIncdules);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllShipments: getShipments,
  // getAll: factory.getAll(Shipment, ShipmentIncdules),
  getOne: factory.getOne(Shipment, ShipmentIncdules),
  create: factory.createOne(Shipment, ShipmentIncdules),
  updateOne: updateShipment,
  deleteOne: async function (req, res, next) {
    try {
      const shipment = await Shipment.findByPk(req.params.id);
      if (!shipment) return res.status(404).json({ message: 'Not found' });

      const subShipments = await SubShipment.findAll({
        where: { shipment_id: req.params.id },
        include: [{ model: CargoToItemType, as: 'cargoToItemType', include: [{ model: Cargo, as: 'cargo' }] }]
      });

      for (const ss of subShipments) {
        const cargoToItemType = ss.cargoToItemType;
        if (cargoToItemType) {
          const qty = cargoToItemType.cargo?.quantity || 0;
          if (qty > 0) await ItemType.decrement('number_of_sold_items', { by: qty, where: { id: cargoToItemType.item_type_id } });
          if (cargoToItemType.cargo) await cargoToItemType.cargo.destroy();
          await cargoToItemType.destroy();
        }
        await ss.destroy();
      }

      await shipment.destroy();
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
