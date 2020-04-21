const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const jwt = require('jsonwebtoken');

exports.checkPhoneExistance = Model =>
    catchAsync(async (req, res, next) => {
        const { phone } = req.body;

        if (!phone) {
            return next(new AppError('Please provide phone number!', 400));
        }

        const user = await Model.findOne({ phone });

        if (user) {
            return next(new AppError('Phone Number already exits!', 400));
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: null
            }
        });
    });


exports.checkEmailExistance = Model =>
    catchAsync(async (req, res, next) => {
        const { email } = req.body;

        if (!email) {
            return next(new AppError('Please provide email id!', 400));
        }

        const user = await Model.findOne({ email });

        if (user) {
            return next(new AppError('Email already exits!', 400));
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: null
            }
        });
    });

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id, user.role);

    res.status(201).json({
        status: 'success',
        data: {
            data: token
        }
    });
}

exports.signup = Model =>
    catchAsync(async (req, res, next) => {
        const newClient = await Model.create({
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password
        });

        createSendToken(newClient, 201, req, res);
    });

exports.verifyPhoneExistance = Model =>
    catchAsync(async (req, res, next) => {
        const { phone } = req.body;

        if (!phone) {
            return next(new AppError('Please provide phone number!', 400));
        }

        const user = await Model.findOne({ phone });

        if (!user) {
            return next(new AppError('Phone Number not exits!', 401));
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: null
            }
        });
    });

exports.login = Model =>
    catchAsync(async (req, res, next) => {
        const { phone, password } = req.body;

        // 1) Check if phone and password exist
        if (!phone || !password) {
            return next(new AppError('Please provide phone and password!', 400));
        }
        // 2) Check if user exists && password is correct
        const user = await Model.findOne({ phone }).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(new AppError('Incorrect phone or password', 401));
        }

        // 3) If everything ok, send token to client
        createSendToken(user, 200, req, res);
    });

exports.protect = catchAsync(async (req, res, next) => {

    // 1) Getting token and check if it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(
            new AppError('You are not logged in! Please login to get access!', 401)
        );
    }

    // 2) token Verification

    // 3) Check if user still exits

    // 4) Check if user changed password after the token was issued

});

exports.restrictTo = (...roles) => {
    // roles ['admin', 'driver'] or role = 'client'
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this action!', 403)
            );
        }

        next();
    }
};
