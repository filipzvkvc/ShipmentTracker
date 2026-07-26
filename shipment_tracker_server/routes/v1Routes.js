const express = require('express');

const usersRoute = require('./usersRoute');
const authRoute = require('./authRoute');
const testRoute = require('./testRoute');
const itemTypeRoute = require('./itemTypeRoute');
const countryRoute = require('./countryRoute');
const shipmentRoute = require('./shipmentRoute');
const shipmentStatusRoute = require('./ShipmentStatusRoute');
const subShipmentStatusRoute = require('./subShipmentStatusRoute');
const statisctisRouter = require('./StatisticRouter');

const cargoRouter = require('./cargoRouter');
const subShipmentRoute = require('./subShipmentRoute');
const CargoToItemTypeRoute = require('./cargoToItemTypeRoute');


const { tokenValidationMiddleware } = require('../middlewares/tokenValidationMiddleware');
const { queryStatsTypeSchemaArray } = require('../validations/statisticsArgumentsSchemas');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', tokenValidationMiddleware, usersRoute);
router.use('/test', testRoute);
router.use('/itemType', itemTypeRoute)
router.use('/country', countryRoute);
router.use('/shipment', shipmentRoute);
router.use('/shipmentStatus', shipmentStatusRoute);
router.use('/subShipmentStatus', subShipmentStatusRoute);
router.use('/statistic', statisctisRouter);

router.use('/cargo', cargoRouter);
router.use('/subShipments', subShipmentRoute);
router.use('/cargoToItemType', CargoToItemTypeRoute);

module.exports = router;
