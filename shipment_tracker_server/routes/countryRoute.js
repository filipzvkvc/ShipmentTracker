const express = require('express');
const countryController = require('../controllers/countryController');

const router = express.Router();

router
    .route('/')
    .get(countryController.getAll)
    .post(countryController.create)

router
    .route('/:id')
    .get(countryController.getOne)

    .patch(countryController.updateOne)
    .delete(countryController.deleteOne);

module.exports = router;
