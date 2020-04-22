const User = require('../models/userModel');
const Client = require('../models/clientModel');
const authController = require('./authController')
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.generatePasswordError = (req, res, next) => {
    if (req.body.password) {
        return next(
            new AppError(
                'This route is not for password updates. Please use /updateMyPassword.',
                400
            )
        );
    }
    next();
}

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.deactivateMe = catchAsync(async (req, res, next) => {
    await Client.findByIdAndUpdate(req.user.id, { isActive: false });

    res.status(200).json({
        status: 'success',
        data: null
    });
});

// Signup Related Controllers
exports.checkPhoneExistance = authController.checkPhoneExistance(Client);
exports.checkEmailExistance = authController.checkEmailExistance(Client);
exports.signup = authController.signup(Client);

// Login Related Controllers
exports.verifyPhoneExistance = authController.verifyPhoneExistance(Client);
exports.login = authController.login(Client);

// Administration Related Controllers
exports.getAllUsers = factory.getAll(Client);
exports.getUser = factory.getOne(Client);
exports.createUser = factory.createOne(Client);
// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(Client);
exports.deleteUser = factory.deleteOne(Client);
