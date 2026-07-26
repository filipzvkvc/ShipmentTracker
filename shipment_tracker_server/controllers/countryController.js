const { COUNTRY_ATTR } = require('../constants/modelConstants');
const Country = require('../models/Country');
const Shipment = require('../models/Shipment');
const factory = require('./handlerFactoryController');
const { ArgumentsValidationError } = require('../utils/errorTypes');


// exports.getAll = factory.getAll(Country);
// exports.getOne = factory.getOne(Country);
// exports.create = factory.createOne(Country);
// exports.updateOne = factory.updateOne(Country);
// exports.deleteOne = factory.deleteOne(Country);


function checkCountryExists() {
    return async function (req, res, next) {
        try {
            const countryName = req.body.name;

            let foundCountry = await Country.findOne({
                where: {
                    [COUNTRY_ATTR.NAME]: countryName,
                    "deletedAt": null
                },
            });
            if (foundCountry != null) throw new ArgumentsValidationError('Country with name '
                + countryName) + ' already exists!';
            next();
        } catch (error) {
            next(error)
        }
    }
}


function checkCountryInUse() {
    return async function (req, res, next) {
        try {
            const count = await Shipment.count({ where: { country_id: req.params.id } });
            if (count > 0)
                return next(new ArgumentsValidationError(
                    `Cannot delete country — it is used by ${count} shipment(s).`
                ));
            next();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = {
    getAll: factory.getAll(Country),
    getOne: factory.getOne(Country),
    create: [checkCountryExists(), factory.createOne(Country)],
    updateOne: [checkCountryExists(), factory.updateOne(Country)],
    deleteOne: [checkCountryInUse(), factory.deleteOne(Country)],
}