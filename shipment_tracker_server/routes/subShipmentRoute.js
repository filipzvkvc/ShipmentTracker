const express = require('express');
const subShipmentController = require('../controllers/subShipmentController');

const router = express.Router();
router.route('/videoUpload')
    .post(subShipmentController.upload.single('attachment'), subShipmentController.uploadFile);
router.route('/user/:userId').get(subShipmentController.getUsersSubShipments);
router.route('/updateStatus/:subShipmentId/:statusId').patch(subShipmentController.updateSubShipmentStatus);
router.route('/updateVideoProof/:subShipmentId').patch(subShipmentController.updateSubShipmentProof);

router.route('/:quantity').post(subShipmentController.create)
router.route('/:shipmentId').get(subShipmentController.getAllFromShipment)

router
    .route('/')
    .get(subShipmentController.getAll)

router
    .route('/:id')
    .patch(subShipmentController.updateOne)
    .delete(subShipmentController.deleteOne);

module.exports = router;
