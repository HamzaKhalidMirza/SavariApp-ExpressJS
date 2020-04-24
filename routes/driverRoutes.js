const express = require('express');
const driverController = require('./../controllers/driverController');
const authController = require('./../controllers/authController');
const vehicleRouter = require('./../routes/vehicleRoutes');

const router = express.Router();

// Login Related Routes
router.get('/verifyPhoneExistance', driverController.verifyPhoneExistance);
router.post('/login', driverController.login);

// Frogot Password Related Routes
router.post('/forgotPassword', driverController.forgotPassword);
router.patch('/resetPassword/:token', driverController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

// Current User Related
router.get(
    '/me',
    authController.restrictTo('driver'),
    driverController.getMe,
    driverController.getUser
);
router.delete(
    '/deleteMe',
    authController.restrictTo('driver'),
    driverController.getMe,
    driverController.deleteUser
);
router.patch(
    '/deactivateMe',
    authController.restrictTo('driver'),
    driverController.deactivateMe
);
router.patch(
    '/updateMyPassword',
    authController.restrictTo('driver'),
    authController.updatePassword
);
router.patch(
    '/updateMe',
    authController.restrictTo('driver'),
    driverController.generatePasswordError,
    driverController.uploadUserPhoto,
    driverController.resizeUserPhoto,
    driverController.updateMe
);

// Vehicle related routes for a specific Driver
router.use('/:driverId/vehicles', vehicleRouter);

// Administration Related Routes
// router.use(authController.restrictTo('admin'));

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