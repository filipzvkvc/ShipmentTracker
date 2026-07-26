const Cargo = require('../models/Cargo');
const ItemType = require('../models/ItemType');
const CargoToItemType = require('../models/CargoToItemType');
const factory = require('./handlerFactoryController');
const CargoToItemTypeIncdules = {
    include: [{ model: ItemType, as: 'itemType' }, { model: Cargo, as: 'cargo' }],
    attributes: { exclude: ['item_type_id', 'cargo_id'] },
}
module.exports = {
    getAll: factory.getAll(CargoToItemType, CargoToItemTypeIncdules),
    getOne: factory.getOne(CargoToItemType, CargoToItemTypeIncdules),
    create: factory.createOne(CargoToItemType, CargoToItemTypeIncdules),
    updateOne: factory.updateOne(CargoToItemType, CargoToItemTypeIncdules),
    deleteOne: factory.deleteOne(CargoToItemType, CargoToItemTypeIncdules),
}