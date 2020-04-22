const Vehicle = require('../models/vehicleModel');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

exports.setDriverId = async (req, res, next) => {
    // Allow nested routes
    if (!req.body.driver) req.body.driver = req.params.driverId;

    const vehicle = await Vehicle.find({driver: req.body.driver});
    if(vehicle.length > 0) {
        return next(new AppError('Already a Vehicle Exits for specified Driver.', 400));
    }

    next();
};

exports.getVehicle = factory.getOne(Vehicle);
exports.getAllVehicles = factory.getAll(Vehicle);
exports.createVehicle = factory.createOne(Vehicle);
exports.updateVehicle = factory.updateOne(Vehicle);
exports.deleteVehicle = factory.deleteOne(Vehicle);
