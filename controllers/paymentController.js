const Payment = require('../models/paymentModel');
const Booking = require('../models/bookinModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');

exports.getPayment = factory.getOne(Payment);
exports.getAllPayments = factory.getAll(Payment);
exports.updatePayment = factory.updateOne(Payment);
exports.deletePayment = factory.deleteOne(Payment);

exports.createPayment = catchAsync(async (req, res, next) => {
    req.body.isPaid = true;
    const payment = await Payment.create(req.body);

    const booking = await Booking.findById(req.params.bookingId);
    booking.payment = payment._id;
    (await booking).save();

    res.status(201).json({
        status: 'success',
        data: {
            data: payment
        }
    });
});
