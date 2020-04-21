const User = require('../models/userModel');
const Driver = require('../models/driverModel');
const authController = require('./authController')
const factory = require('./handlerFactory');

exports.verifyPhoneExistance = authController.verifyPhoneExistance(Driver);
exports.login = authController.login(Driver);

exports.getUser = factory.getOne(Driver);
exports.getAllUsers = factory.getAll(Driver);
exports.createUser = factory.createOne(Driver);

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(Driver);
exports.deleteUser = factory.deleteOne(Driver);
