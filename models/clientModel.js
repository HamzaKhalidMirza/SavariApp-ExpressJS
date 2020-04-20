const mongoose = require('mongoose');
const validator = require('validator');

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
        photo_avatar: {
            type: String,
            default: 'default.jpg'
        },
        photo_avatar_ext: {
            type: String
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        nationality: String,
        dob: Date,
        isActive: {
            type: Boolean,
            default: true,
            select: false
        },
        age: {
            type: number,
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
    }
);

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;