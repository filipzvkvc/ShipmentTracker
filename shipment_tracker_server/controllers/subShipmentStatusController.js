const SubShipmentStatus = require('../models/SubShipmentStatus');
const factory = require('./handlerFactoryController');

module.exports = {
    getAll: factory.getAll(SubShipmentStatus),
    getOne: factory.getOne(SubShipmentStatus),
    create: factory.createOne(SubShipmentStatus),
    updateOne: factory.updateOne(SubShipmentStatus),
    deleteOne: factory.deleteOne(SubShipmentStatus),
}