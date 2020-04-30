const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// Protect all routes after this middleware
router.use(authController.protect);

router.get(
    '/getClientBookings',
    authController.restrictTo('lead-admin', 'assistant-admin'),
    bookingController.getSpecificClientAllBookings
);

router.get(
    '/getTripBookings',
    authController.restrictTo('lead-admin', 'assistant-admin'),
    bookingController.getSpecificTripAllBookings
);

router.get(
    '/getCurrentClientBookings',
    authController.restrictTo('client'),
    bookingController.getMe,
    bookingController.getCurrentClientBookings
);

router.patch(
    '/cancelBooking/:id',
    authController.restrictTo('client', 'driver'),
    bookingController.cancelBooking,
    bookingController.filterData,
    bookingController.updateBooking
);

router
    .route('/')
    .get(
        authController.restrictTo('lead-admin', 'assistant-admin'),
        bookingController.getAllBookings
    )
    .post(
        authController.restrictTo('client'),
        bookingController.setTripClientIds,
        bookingController.createBooking
    );

router
    .route('/:id')
    .get(
        authController.restrictTo('lead-admin', 'assistant-admin'),
        bookingController.getBooking
    )
    .patch(
        authController.restrictTo('client'),
        bookingController.updateBooking
    )
    .delete(
        authController.restrictTo('lead-admin', 'assistant-admin'),
        bookingController.deleteBooking
    );

module.exports = router;