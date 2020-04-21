const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.getReview = factory.getOne(Review);
exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);

// Do NOT update passwords with this!
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
