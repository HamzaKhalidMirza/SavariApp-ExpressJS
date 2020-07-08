const mongoose = require('mongoose');
const validator = require('validator');

const vehicleSchema = new mongoose.Schema(
    {
        modelName: {
            type: String,
            required: [true, "Please provide vehicle model name"]
        },
        totalSeats: {
            type: String,
            required: [true, "Please provide total seats"]
        },
        modelCode: {
            type: String,
            required: [true, "Please provide vehicle model code"]
        },
        make: {
            type: String,
            required: [true, "Please provide vehicle make"]
        },
        registrationNo: {
            type: String,
            unique: true,
            required: [true, "Please provide vehicle registration no"]
        },
        color: {
            type: String,
            required: [true, "Please provide vehicle color"]
        },
        milage: {
            type: Number,
            required: [true, "Please provide vehicle milage"]
        },
        vehicleAvatar: {
            type: String,
            required: [true, 'Please provide vehicle photo']
        },
        orignalVehicle: String,
        vehicleAvatarExt: String,
        description: {
            type: String,
            trim: true,
            maxlength: [40, 'Description must be less or equal then 40 characters.'],
            minlength: [10, 'Description must be more or equal then 10 characters.']
        },
        type: {
            type: String,
            enum: {
                values: ['mini', 'moto', 'bike'],
                message: 'Type is either: mini, moto or bike'
            },
            required: [true, "Please provide vehicle type"]
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        driver: {
            type: mongoose.Schema.ObjectId,
            ref: 'Driver',
            required: [true, 'Vehicle must belong to a driver.']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// vehicleSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: 'driver',
//         select: `-photoAvatar -photoAvatarFile -passwordChangedAt -passwordResetToken -passwordResetExpires
//         -isActive -createdAt -ratingsAverage -ratingsQuantity`
//     });
//     next();
// });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;