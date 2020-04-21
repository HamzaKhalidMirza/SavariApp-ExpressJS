const Trip = require('../models/tripModel');
const factory = require('./handlerFactory');

exports.getTrip = factory.getOne(Trip);
exports.getAllTrips = factory.getAll(Trip);
exports.createTrip = factory.createOne(Trip);

// Do NOT update passwords with this!
exports.updateTrip = factory.updateOne(Trip);
exports.deleteTrip = factory.deleteOne(Trip);
