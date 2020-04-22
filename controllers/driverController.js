const User = require('../models/userModel');
const Driver = require('../models/driverModel');
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
    await Driver.findByIdAndUpdate(req.user.id, { isActive: false });

    res.status(200).json({
        status: 'success',
        data: null
    });
});

// Login Related Controllers
exports.verifyPhoneExistance = authController.verifyPhoneExistance(Driver);
exports.login = authController.login(Driver);

// Administration Related Controllers
exports.getUser = factory.getOne(Driver);
exports.getAllUsers = factory.getAll(Driver);
exports.createUser = factory.createOne(Driver);
// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(Driver);
exports.deleteUser = factory.deleteOne(Driver);
