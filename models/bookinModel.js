const mongoose = require('mongoose');
const validator = require('validator');

const bookingSchema = new mongoose.Schema(
    {
        seatsReserved: {
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
        status: {
            type: String,
            require: [true, "Please provide vehicle type"],
            enum: {
                values: ['upcoming', 'current', 'complete', 'cancelled'],
                message: 'Status is either: upcoming, current, complete or cancelled'
            }
        },
        cancellationEnd: {
            type: String,
            enum: {
                values: ['client', 'driver'],
                message: 'Cancellation End is either: driver or client'
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
        appStartTime: Date,
        appEndTime: Date,
        appEstimatedTime: Date,
        appDistance: String,
        appFare: Number,
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
        client: {
            type: mongoose.Schema.ObjectId,
            ref: 'Client',
            required: [true, 'Booking must belong to a client.']
        },
        trip: {
            type: mongoose.Schema.ObjectId,
            ref: 'Trip',
            required: [true, 'Booking must belong to a trip.']
        },
        payment: {
            type: mongoose.Schema.ObjectId,
            ref: 'Payment',
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;