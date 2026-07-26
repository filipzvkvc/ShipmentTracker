const express = require('express');
const cargoToItemTypeController = require('../controllers/cargoToItemTypeController');
const router = express.Router();

router
    .route('/')
    .get(cargoToItemTypeController.getAll)
    .post(cargoToItemTypeController.create)

router
    .route('/:id')
    .get(cargoToItemTypeController.getOne)
    .patch(cargoToItemTypeController.updateOne)
    .delete(cargoToItemTypeController.deleteOne);

module.exports = router;
