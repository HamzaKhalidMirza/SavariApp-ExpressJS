const express = require('express');
const clientController = require('../controllers/clientController');
const authController = require('../controllers/authController');
const bookingRouter = require('./../routes/bookingRoutes');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// Signup Related Routes
router.get('/checkPhoneExistance', clientController.checkPhoneExistance);
router.get('/checkEmailExistance', clientController.checkEmailExistance);
router.post('/getVerificationCode', clientController.getVerificationCode);
router.patch('/verifyCode', clientController.verifyCode);
router.post('/signup', clientController.signup);

// Login Related Routes
router.get('/verifyPhoneExistance', clientController.verifyPhoneExistance);
router.post('/login', clientController.login);

// Frogot Password Related Routes
router.post('/forgotPassword', clientController.forgotPassword);
router.patch('/resetPassword/:token', clientController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

// Review related routes for a specific Client
router.use('/:clientId/reviews', reviewRouter);

// Current User Related
router.get(
    '/me',
    authController.restrictTo('client'),
    clientController.getMe,
    clientController.getUser
);
router.delete(
    '/deleteMe',
    authController.restrictTo('client'),
    clientController.getMe,
    clientController.deleteUser
);
router.patch(
    '/deactivateMe',
    authController.restrictTo('client'),
    clientController.deactivateMe
);
router.patch(
    '/updateMyPassword',
    authController.restrictTo('client'),
    authController.updatePassword
);
router.patch(
    '/updateMe',
    authController.restrictTo('client'),
    clientController.generatePasswordError,
    clientController.uploadUserPhoto,
    clientController.resizeUserPhoto,
    clientController.filterData,
    clientController.setPhotoData,
    clientController.updateMe
);

// Trip related routes for a specific Driver
router.use('/:clientId/bookings', bookingRouter);

// Administration Related Routes
router.use(authController.restrictTo('lead-admin', 'assistant-admin'));

router
    .route('/')
    .get(clientController.getAllUsers)
    .post(clientController.createUser);

router
    .route('/:id')
    .get(clientController.getUser)
    .patch(
        clientController.generatePasswordError,
        clientController.uploadUserPhoto,
        clientController.resizeUserPhoto,
        clientController.filterData,
        clientController.setPhotoData,
        clientController.updateUser
    )
    .delete(clientController.deleteUser);

module.exports = router;