const Cargo = require('../models/Cargo');
const ItemType = require('../models/ItemType');
const factory = require('./handlerFactoryController');
const CargoIncdules = {
    include: [{ model: ItemType, as: 'itemType' }],
    attributes: { exclude: ['item_type_id'] },
}
module.exports = {
    getAll: factory.getAll(Cargo, CargoIncdules),
    getOne: factory.getOne(Cargo, CargoIncdules),
    create: factory.createOne(Cargo, CargoIncdules),
    updateOne: factory.updateOne(Cargo, CargoIncdules),
    deleteOne: factory.deleteOne(Cargo, CargoIncdules),
}