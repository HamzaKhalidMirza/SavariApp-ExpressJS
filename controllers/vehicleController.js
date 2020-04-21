const Vehicle = require('../models/vehicleModel');
const factory = require('./handlerFactory');

exports.setDriverIds = (req, res, next) => {
    // Allow nested routes
    if (!req.body.driver) req.body.driver = req.params.driverId;
    next();
};

exports.getVehicle = factory.getOne(Vehicle);
exports.getAllVehicles = factory.getAll(Vehicle);
exports.createVehicle = factory.createOne(Vehicle);
exports.updateVehicle = factory.updateOne(Vehicle);
exports.deleteVehicle = factory.deleteOne(Vehicle);
