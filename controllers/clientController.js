const User = require('../models/userModel');
const Client = require('../models/clientModel');
const authController = require('./authController')
const factory = require('./handlerFactory');

exports.checkPhoneExistance = authController.checkPhoneExistance(Client);
exports.checkEmailExistance = authController.checkEmailExistance(Client);
exports.signup = authController.signup(Client);

exports.verifyPhoneExistance = authController.verifyPhoneExistance(Client);
exports.login = authController.login(Client);

exports.getAllUsers = factory.getAll(Client);
exports.getUser = factory.getOne(Client);
exports.createUser = factory.createOne(Client);

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(Client);
exports.deleteUser = factory.deleteOne(Client);
