const mongoose = require('mongoose');
const validator = require('validator');

const reviewSchema = new mongoose.Schema(
    {
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
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;