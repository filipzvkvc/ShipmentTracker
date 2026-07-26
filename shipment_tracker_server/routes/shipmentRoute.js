const express = require('express');
const shipmentController = require('../controllers/shipmentController');
const router = express.Router();

router
  .route('/')
  //   .get(shipmentController.getAll)
  .get(shipmentController.getAllShipments)
  .post(shipmentController.create);

router
  .route('/:id')
  .get(shipmentController.getOne)

  .patch(shipmentController.updateOne)
  .delete(shipmentController.deleteOne);

module.exports = router;
