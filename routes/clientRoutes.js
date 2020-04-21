const express = require('express');
const clientController = require('../controllers/clientController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/checkPhoneExistance', clientController.checkPhoneExistance);
router.get('/checkEmailExistance', clientController.checkEmailExistance);
router.post('/signup', clientController.signup);

router.get('/verifyPhoneExistance', clientController.verifyPhoneExistance);
router.post('/login', clientController.login);

router.use(authController.restrictTo('admin'));

router
    .route('/')
    .get(clientController.getAllUsers)
    .post(clientController.createUser);

router
    .route('/:id')
    .get(clientController.getUser)
    .patch(clientController.updateUser)
    .delete(clientController.deleteUser);

module.exports = router;