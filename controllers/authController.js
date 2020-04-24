const Client = require('./../models/clientModel');
const Driver = require('./../models/driverModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');

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

const signToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id, user.role);
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token: token,
        data: {
            data: user
        }
    });
}

exports.signup = Model =>
    catchAsync(async (req, res, next) => {
        const newUser = await Model.create({
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password
        });

        const url = `${req.protocol}://${req.get('host')}/me`;
        await new Email(newUser, url).sendWelcome();

        createSendToken(newUser, 201, req, res);
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

const Model = (role) => {
    if (role === 'client') {
        return Client;
    } else if (role === 'driver') {
        return Driver;
    }
}

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
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const userRole = decoded.role;
    console.log(userRole);
    User = Model(userRole);

    //   3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exist.',
                401
            )
        );
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError('User recently changed password! Please log in again.', 401)
        );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
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

exports.updatePassword = catchAsync(async (req, res, next) => {

    User = Model(req.user.role);
    const { password, passwordCurrent } = req.body;

    if (!password || !passwordCurrent) {
        return next(new AppError('Please provide New and Old passwords.', 400));
    }

    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong.', 401));
    }

    // 3) If so, update password
    user.password = password;
    await user.save();
    // User.findByIdAndUpdate will NOT work as intended!

    // 4) Log user in, send JWT
    createSendToken(user, 200, req, res);
});

exports.forgotPassword = Model =>
    catchAsync(async (req, res, next) => {

        if (!req.body.email) {
            return next(new AppError('Please provide email address.', 400));
        }

        let users;
        if (Model === Client) {
            users = 'clients'
        } else if (Model === Driver) {
            users = 'drivers'
        }

        // 1) Get user based on POSTed email
        const user = await Model.findOne({ email: req.body.email });
        if (!user) {
            return next(new AppError('There is no user with email address.', 404));
        }

        // 2) Generate the random reset token
        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        // 3) Send it to user's email
        try {
            const resetURL = `${req.protocol}://${req.get(
                'host'
            )}/api/v1/${users}/resetPassword/${resetToken}`;
            await new Email(user, resetURL).sendPasswordReset();

            res.status(200).json({
                status: 'success',
                message: 'Token sent to email!'
            });
        } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });
            console.log('err', err);

            return next(
                new AppError('There was an error sending the email. Try again later!'),
                500
            );
        }
    });

exports.resetPassword = Model =>
    catchAsync(async (req, res, next) => {
        // 1) Get user based on the token
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await Model.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        // 2) If token has not expired, and there is user, set the new password
        if (!user) {
            return next(new AppError('Token is invalid or has expired', 400));
        }
        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        // 3) Update changedPasswordAt property for the user
        // 4) Log the user in, send JWT
        createSendToken(user, 200, req, res);
    });

