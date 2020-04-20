const mongoose = require('mongoose');
const validator = require('validator');

const vehicleSchema = new mongoose.Schema(
    {
        modelName: {
            type: String,
            require: [true, "Please provide vehicle model name"]
        },
        modelCode: {
            type: String,
            require: [true, "Please provide vehicle model code"]
        },
        make: {
            type: String,
            require: [true, "Please provide vehicle make"]
        },
        registration_no: {
            type: String,
            require: [true, "Please provide vehicle registration no"]
        },
        color: {
            type: String,
            require: [true, "Please provide vehicle color"]
        },
        milage: {
            type: Number,
            require: [true, "Please provide vehicle milage"]
        },
        photo_avatar: {
            type: String,
            require: [true, "Please provide vehicle Photo"],
            default: 'default.jpg'
        },
        pic_avatar_ext: String,
        description: {
            type: String,
            trim: true,
            maxlength: [40, 'Description must be less or equal then 40 characters.'],
            minlength: [10, 'Description must be more or equal then 10 characters.'],
            validate: [validator.isAlphanumeric, `Please provide valid description. 
        Must be characters or number!`]
        },
        type: {
            type: String,
            require: [true, "Please provide vehicle type"],
            enum: {
                values: ['mini', 'moto', 'bike'],
                message: 'Type is either: mini, moto or bike'
            }
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        }
    }
);