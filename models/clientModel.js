const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const randomGenerator = require("randomatic");

const clientSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            maxlength: [30, 'Username must be less or equal then 30 characters.'],
            minlength: [8, 'Username must be more or equal then 8 characters.'],
            validate: [validator.isAlphanumeric, `Please provide valid username. 
            Must be characters or number!`]
        },
        fName: {
            type: String,
            trim: true,
            maxlength: [20, 'FName must be less or equal then 20 characters.'],
            minlength: [8, 'FName must be more or equal then 8 characters.'],
            validate: [validator.isAlphanumeric, `Please provide valid FName. 
            Must be characters or number!`]
        },
        lName: {
            type: String,
            trim: true,
            maxlength: [20, 'LName must be less or equal then 20 characters.'],
            minlength: [8, 'LName must be more or equal then 8 characters.'],
            validate: [validator.isAlphanumeric, `Please provide valid LName. 
            Must be characters or number!`]
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email']
        },
        phone: {
            type: String,
            required: [true, 'Please provide your phone'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 8,
            select: false
        },
        gender: {
            type: String,
            enum: {
                values: ['male', 'female'],
                message: 'Gender is either: male or female'
            }
        },
        role: {
            type: String,
            enum: ['client'],
            default: 'client'
        },
        photoAvatar: {
            type: String,
            default: 'default.jpg'
        },
        orignalPhoto: String,
        // photoAvatarExt: String,
        photoAvatarFile: String,
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        mobileCode: String,
        mobileCodeExpires: Date,
        countryCode: String,
        nationality: String,
        dob: Date,
        isActive: {
            type: Boolean,
            default: true
            // select: false
        },
        age: {
            type: Number,
            validate: {
                validator: function (val) {
                    return val > 15;
                }
            }
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0'],
            set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

clientSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    next();
});

clientSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

clientSchema.pre(/^find/, function (next) {
    // this points to the current query
    this.find({ isActive: { $ne: false } });
    next();
});

clientSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

clientSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};

clientSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;