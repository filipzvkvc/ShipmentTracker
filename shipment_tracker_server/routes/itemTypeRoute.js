const express = require('express');
const itemTypeController = require('../controllers/itemTypeController');

const router = express.Router();

router
    .route('/')
    .get(itemTypeController.getAll)
    .post(itemTypeController.create)

router
    .route('/:id')
    .get(itemTypeController.getOne)

    .patch(itemTypeController.updateOne)
    .delete(itemTypeController.deleteOne);

module.exports = router;
