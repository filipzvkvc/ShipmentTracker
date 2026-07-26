const ShipmentStatus = require('../models/ShipmentStatus');
const factory = require('./handlerFactoryController');

module.exports = {
    getAll: factory.getAll(ShipmentStatus),
    getOne: factory.getOne(ShipmentStatus),
    create: factory.createOne(ShipmentStatus),
    updateOne: factory.updateOne(ShipmentStatus),
    deleteOne: factory.deleteOne(ShipmentStatus),
}