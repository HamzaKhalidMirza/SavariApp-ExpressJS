const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.setTripUserIds = (req, res, next) => {
    // Allow nested routes
    if (!req.body.trip) req.body.trip = req.params.tripId;
    req.body.givenBy = req.user.role;

    if (req.user.role === 'client') {
        req.body.client = req.user.id;
    } else if (req.user.role === 'driver') {
        req.body.driver = req.user.id;
    }

    next();
};

exports.getMe = (req, res, next) => {
    if (req.user.role === 'client') {
        req.params.clientId = req.user.id;
    } else if (req.user.role === 'driver') {
        req.params.driverId = req.user.id;
    }
    next();
};

exports.getSpecificClientAllReviews = factory.getAll(Review);
exports.getSpecificDriverAllReviews = factory.getAll(Review);
exports.getSpecificTripAllReviews = factory.getAll(Review);
exports.getCurrentUserReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review);
exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
