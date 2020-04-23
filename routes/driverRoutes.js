const express = require('express');
const driverController = require('./../controllers/driverController');
const authController = require('./../controllers/authController');
const vehicleRouter = require('./../routes/vehicleRoutes');

const router = express.Router();

// Login Related Routes
router.get('/verifyPhoneExistance', driverController.verifyPhoneExistance);
router.post('/login', driverController.login);

// Protect all routes after this middleware
router.use(authController.protect);

// Current User Related
router.get('/me', driverController.getMe, driverController.getUser);
router.delete('/deleteMe', driverController.getMe, driverController.getUser);
router.patch('/deactivateMe', driverController.deactivateMe);
router.patch('/updateMyPassword', authController.updatePassword);
router.patch(
    '/updateMe',
    driverController.generatePasswordError,
    driverController.uploadUserPhoto,
    driverController.resizeUserPhoto,
    driverController.updateMe
);

// Administration Related Routes
// router.use(authController.restrictTo('admin'));

// Vehicle related routes for a specific Driver
router.use('/:driverId/vehicles', vehicleRouter);

router
    .route('/')
    .get(driverController.getAllUsers)
    .post(driverController.createUser);

router
    .route('/:id')
    .get(driverController.getUser)
    .patch(
        driverController.generatePasswordError,
        driverController.updateUser
    )
    .delete(driverController.deleteUser);

module.exports = router;