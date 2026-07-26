const ItemType = require('../models/ItemType');
const CargoToItemType = require('../models/CargoToItemType');
const { ITEM_TYPE_ATTR } = require('../constants/modelConstants.js');
const factory = require('./handlerFactoryController');
const { ArgumentsValidationError } = require('../utils/errorTypes');

function checkItemTypeExists() {
  return async function (req, res, next) {
    try {
      const itemTypeName = req.body.name;
      console.log(itemTypeName);

      let foundItemType = await ItemType.findOne({
        where: {
          [ITEM_TYPE_ATTR.NAME]: itemTypeName,
          deletedAt: null,
        },
      });
      console.log(foundItemType);
      if (foundItemType != null)
        throw (
          new ArgumentsValidationError('Item with name ' + itemTypeName) +
          ' already exists!'
        );
      next();
    } catch (error) {
      next(error);
    }
  };
}

function checkItemTypeInUse() {
  return async function (req, res, next) {
    try {
      const count = await CargoToItemType.count({ where: { item_type_id: req.params.id } });
      if (count > 0)
        return next(new ArgumentsValidationError(
          `Cannot delete item type — it is used by ${count} cargo record(s).`
        ));
      next();
    } catch (error) {
      next(error);
    }
  };
}

exports.getAll = factory.getAll(ItemType);
exports.getOne = factory.getOne(ItemType);
exports.create = [checkItemTypeExists(), factory.createOne(ItemType)];
exports.updateOne = [checkItemTypeExists(), factory.updateOne(ItemType)];
exports.deleteOne = [checkItemTypeInUse(), factory.deleteOne(ItemType)];
