const express = require('express');
const SubShipmentStatusController = require('../controllers/subShipmentStatusController');
const router = express.Router();

router
    .route('/')
    .get(SubShipmentStatusController.getAll)
    .post(SubShipmentStatusController.create)
router
    .route('/:id')
    .get(SubShipmentStatusController.getOne)
    .patch(SubShipmentStatusController.updateOne)
    .delete(SubShipmentStatusController.deleteOne);

module.exports = router;