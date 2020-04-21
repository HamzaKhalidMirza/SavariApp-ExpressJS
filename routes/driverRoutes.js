const express = require('express');
const driverController = require('./../controllers/driverController');
const authController = require('./../controllers/authController');
const vehicleRouter = require('./../routes/vehicleRoutes');

const router = express.Router();

router.use('/:driverId/vehicles', vehicleRouter);

router.get('/verifyPhoneExistance', driverController.verifyPhoneExistance);
router.post('/login', driverController.login);

// router.use(authController.restrictTo('admin'));

router
    .route('/')
    .get(driverController.getAllUsers)
    .post(driverController.createUser);

router
    .route('/:id')
    .get(driverController.getUser)
    .patch(driverController.updateUser)
    .delete(driverController.deleteUser);

module.exports = router;