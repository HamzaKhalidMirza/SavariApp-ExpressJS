const Payment = require('../models/paymentModel');
const factory = require('./handlerFactory');

exports.getPayment = factory.getOne(Payment);
exports.getAllPayments = factory.getAll(Payment);
exports.createPayment = factory.createOne(Payment);

exports.updatePayment = factory.updateOne(Payment);
exports.deletePayment = factory.deleteOne(Payment);
