const mongoose = require('mongoose');
const validator = require('validator');

const reviewSchema = new mongoose.Schema(
    {
        givenBy: {
            type: String,
            required: [true, 'A review must have a givenBy role.'],
            enum: {
                values: ['client', 'driver'],
                message: 'Review is either given by: client or driver'
            }
        },
        review: {
            type: String,
            maxlength: [100, 'Review must be less or equal then 100 characters.'],
            minlength: [5, 'Review must be more or equal then 5 characters.']
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: [true, 'Rating must be provided!']
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        trip: {
            type: mongoose.Schema.ObjectId,
            ref: 'Trip',
            required: [true, 'Review must belong to a trip.']
        },
        client: {
            type: mongoose.Schema.ObjectId,
            ref: 'Client',
            required: [true, 'Review must belong to a client.']
        },
        driver: {
            type: mongoose.Schema.ObjectId,
            ref: 'Driver',
            required: [true, 'Review must belong to a driver.']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'client',
        select: `-passwordChangedAt -passwordResetToken -passwordResetExpires
        -isActive -createdAt -ratingsQuantity`
    }).populate({
        path: 'driver',
        select: `-photoAvatarFile -passwordChangedAt -passwordResetToken -passwordResetExpires
        -isActive -createdAt -ratingsAverage -ratingsQuantity`
    }).populate({
        path: 'trip',
        select: `-estimatedTime -cancellationReason -ratingsAverage -ratingsQuantity
        -createdAt`
    });
    next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;