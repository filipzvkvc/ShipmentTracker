const express = require('express');
const StatisticController = require('../controllers/StatisctisController');

const router = express.Router();

// router.route('/getShipmentsByMonth').get(StatisticController.getBymonth);
router.route('/getShipmentsByMonth/:dateFrom/:dateTo').get(StatisticController.getBymonth);
router.route('/getItemTypesStatistics').get(StatisticController.getStatisticksForItemTypes);

module.exports = router;
