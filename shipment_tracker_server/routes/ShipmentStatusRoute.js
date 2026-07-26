const express = require('express');
const shipmentStatusController = require('../controllers/shipmentStatusController');
const router = express.Router();

router
    .route('/')
    .get(shipmentStatusController.getAll)
    .post(shipmentStatusController.create)

router
    .route('/:id')
    .get(shipmentStatusController.getOne)
    .patch(shipmentStatusController.updateOne)
    .delete(shipmentStatusController.deleteOne);

module.exports = router;
