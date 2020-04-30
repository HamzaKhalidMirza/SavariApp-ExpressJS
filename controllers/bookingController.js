const Booking = require('../models/bookinModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.filterData = catchAsync(async (req, res, next) => {
    const filteredBody = filterObj(req.body, 'status', 'cancellationReason','cancellationEnd');
    req.body = filteredBody;
    next();
});

exports.setClientId = async (req, res, next) => {
  // Allow nested routes
  if (!req.body.client) req.body.client = req.params.clientId;
  next();
};

exports.getMe = (req, res, next) => {
    req.params.clientId = req.user.id;
    next();
};

exports.cancelBooking = catchAsync(async (req, res, next) => {
    req.body.status = "cancelled";
    req.body.cancellationEnd = req.user.role;
    next();
});

exports.getSpecificClientAllBookings = factory.getAll(Booking);
exports.getSpecificTripAllBookings = factory.getAll(Booking);
exports.getCurrentClientBookings = factory.getAll(Booking);

exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.createBooking = factory.createOne(Booking);

exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
