const path = require('path');
const User = require('../models/userModel');
const readFilePro = require('./../utils/readFilePro');
const Client = require('../models/clientModel');
const authController = require('./authController')
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photoAvatar');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `client-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/clients/${req.file.filename}`);

    next();
});

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

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    // Already Check using GeneratePasswordError

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'username', 'lName', 'fName', 'email', 'gender',
        'dob', 'age');
    if (req.file) {
        const fileData = await readFilePro(`public/img/clients/${req.file.filename}`);
        filteredBody.photoAvatarFile = fileData;
        filteredBody.photoAvatar = req.file.filename;
        filteredBody.orignalPhoto = req.file.originalname.split('.')[0];
        // filteredBody.photoAvatarExt = path.extname(req.file.originalname);
    }

    // 3) Update user document
    const updatedUser = await Client.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

// Signup Related Controllers
exports.checkPhoneExistance = authController.checkPhoneExistance(Client);
exports.checkEmailExistance = authController.checkEmailExistance(Client);
exports.getVerificationCode = authController.getVerificationCode;
exports.verifyCode = authController.verifyCode;
exports.signup = authController.signup(Client);

// Login Related Controllers
exports.verifyPhoneExistance = authController.verifyPhoneExistance(Client);
exports.login = authController.login(Client);

// Forgot Password Related Controllers
exports.forgotPassword = authController.forgotPassword(Client);
exports.resetPassword = authController.resetPassword(Client);

// Administration Related Controllers
exports.getAllUsers = factory.getAll(Client);
exports.getUser = factory.getOne(Client);
exports.createUser = factory.createOne(Client);
// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(Client);
exports.deleteUser = factory.deleteOne(Client);
