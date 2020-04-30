const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

// Protect all routes after this middleware
router.use(authController.protect);

router.get(
    '/getClientReviews',
    authController.restrictTo('lead-admin', 'assistant-admin'),
    reviewController.getSpecificClientAllReviews
);

router.get(
    '/getDriverReviews',
    authController.restrictTo('lead-admin', 'assistant-admin'),
    reviewController.getSpecificDriverAllReviews
);

router.get(
    '/getTripReviews',
    authController.restrictTo('lead-admin', 'assistant-admin'),
    reviewController.getSpecificTripAllReviews
);

router.get(
    '/getCurrentUserReviews',
    authController.restrictTo('client', 'driver'),
    reviewController.getMe,
    reviewController.getCurrentUserReviews
);

router
    .route('/')
    .get(
        authController.restrictTo('lead-admin', 'assistant-admin'),
        reviewController.getAllReviews
    )
    .post(
        authController.restrictTo('client', 'driver'),
        reviewController.setTripUserIds,
        reviewController.createReview
    );

router
    .route('/:id')
    .get(
        authController.restrictTo('lead-admin', 'assistant-admin'),
        reviewController.getReview
    )
    .patch(
        authController.restrictTo('client', 'driver'),
        reviewController.updateReview
    )
    .delete(
        authController.restrictTo('lead-admin', 'assistant-admin'),
        reviewController.deleteReview
    );

module.exports = router;