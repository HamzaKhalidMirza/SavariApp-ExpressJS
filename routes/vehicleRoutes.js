const express = require('express');
const vehicleController = require('../controllers/vehicleController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(vehicleController.getAllVehicles)
    .post(
        // authController.restrictTo('admin'),
        vehicleController.setDriverIds,
        vehicleController.createVehicle
    );

router
    .route('/:id')
    .get(vehicleController.getVehicle)
    .patch(vehicleController.updateVehicle)
    .delete(vehicleController.deleteVehicle);

module.exports = router;