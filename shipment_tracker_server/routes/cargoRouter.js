const express = require('express');
const cargoController = require('../controllers/cargoController');
const router = express.Router();

router
    .route('/')
    .get(cargoController.getAll)
    .post(cargoController.create)

router
    .route('/:id')
    .get(cargoController.getOne)
    .patch(cargoController.updateOne)
    .delete(cargoController.deleteOne);

module.exports = router;
