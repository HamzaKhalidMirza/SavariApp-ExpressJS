const mongoose = require('mongoose');
const validator = require('validator');

const tripSchema = new mongoose.Schema(
    {
        seatsAvailable: {
            type: Number,
            require: [true, 'Please provide number of available seats.'],
            min: [1, 'Available Seats must be at least 1.']
        },
        description: {
            type: String,
            trim: true,
            maxlength: [100, 'Description must be less or equal then 100 characters.'],
            minlength: [10, 'Description must be more or equal then 10 characters.'],
            validate: [validator.isAlphanumeric, `Please provide valid description. 
        Must be characters or number!`]
        },
        startDate: {
            type: Date,
            require: [true, 'Please provide start date.']
        },
        startTime: {
            type: Date,
            require: [true, 'Please provide start time.']
        },
        estimatedTime: Date,
        status: {
            type: String,
            require: [true, "Please provide vehicle type"],
            enum: {
                values: ['upcoming', 'current', 'complete', 'cancelled'],
                message: 'Status is either: upcoming, current, complete or cancelled'
            }
        },
        cancellationReason: {
            type: String,
            trim: true,
            maxlength: [100, 'Reason must be less or equal then 100 characters.'],
            minlength: [10, 'Reason must be more or equal then 10 characters.'],
            validate: [validator.isAlphanumeric, `Please provide valid Reason. 
        Must be characters or number!`]
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
        appEndTime: Date,
        appEstimatedTime: Date,
        appDistance: String,
        appTotalFare: Number,
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        startLocation: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            staticImage: String
        },
        endLocation: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            staticImage: String
        },
        driver: {
            type: mongoose.Schema.ObjectId,
            ref: 'Driver',
            required: [true, 'Trip must belong to a driver.']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;