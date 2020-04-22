const express = require('express');
const clientController = require('../controllers/clientController');
const authController = require('../controllers/authController');

const router = express.Router();

// Signup Related Routes
router.get('/checkPhoneExistance', clientController.checkPhoneExistance);
router.get('/checkEmailExistance', clientController.checkEmailExistance);
router.post('/signup', clientController.signup);

// Login Related Routes
router.get('/verifyPhoneExistance', clientController.verifyPhoneExistance);
router.post('/login', clientController.login);

// Protect all routes after this middleware
router.use(authController.protect);

// Current User Related
router.get('/me', clientController.getMe, clientController.getUser);
router.delete('/deleteMe', clientController.getMe, clientController.deleteUser);
router.patch('/deactivateMe', clientController.deactivateMe);
router.patch('/updateMyPassword', authController.updatePassword);

// Administration Related Routes
router.use(authController.restrictTo('admin'));

router
    .route('/')
    .get(clientController.getAllUsers);
// .post(clientController.createUser);

router
    .route('/:id')
    .get(clientController.getUser)
    .patch(
        clientController.generatePasswordError,
        clientController.updateUser
    )
    .delete(clientController.deleteUser);

module.exports = router;