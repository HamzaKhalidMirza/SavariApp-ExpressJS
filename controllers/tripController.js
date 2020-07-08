const Trip = require('../models/tripModel');
const Driver = require('../models/driverModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.filterData = catchAsync(async (req, res, next) => {
    const filteredBody = filterObj(req.body, 'status', 'cancellationReason');
    req.body = filteredBody;
    next();
});

exports.setDriverId = async (req, res, next) => {
  // Allow nested routes
  if (!req.body.driver) req.body.driver = req.params.driverId;
  next();
};

exports.setVehicleId = catchAsync( async (req, res, next) => {
  const doc = await Driver.findById(req.body.driver).populate('vehicle');
  
  if (!doc) {
    return next(new AppError('No Vehicle found with that ID', 404));
  }
  req.body.vehicle = doc.vehicle[0].id;

  next();
});

exports.getMe = (req, res, next) => {
    req.params.driverId = req.user.id;
    next();
};

exports.cancelTrip = catchAsync(async (req, res, next) => {
    req.body.status = "cancelled";
    next();
});

exports.getSpecificDriverAllTrips = factory.getAll(Trip);
exports.getSpecificDriverTrip = factory.getOne(Trip);

exports.getSpecificClientAllTrips = catchAsync(async (req, res, next) => {

});
exports.getSpecificClientTrip = catchAsync(async (req, res, next) => {
    
});

exports.getCurrentDriverTrips = factory.getAll(Trip);
exports.getCurrentDriverTrip = factory.getOne(Trip);

exports.getCuurentClientTrips = catchAsync(async (req, res, next) => {

});
exports.getCurrentClientTrip = catchAsync(async (req, res, next) => {

});

exports.getTripsWithin = catchAsync(async (req, res, next) => {
    const distance = 3;
    const radius = distance / 6378.1;
    const { startLatLng, endLatLng } = req.params;
    const [startLat, startLng] = startLatLng.split(',');
    const [endLat, endLng] = endLatLng.split(',');
  
    // const { distance, latlng, unit } = req.params;
    // const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  
    if (!startLat || !startLng) {
      next(
        new AppError(
          'Please provide latitutr and longitude in the format lat,lng.',
          400
        )
      );
    }
  
    const trips = await Trip.find({
      startLocation: { $geoWithin: { $centerSphere: [[startLng, startLat], radius] } },
      endLocation: { $geoWithin: { $centerSphere: [[endLng, endLat], radius] } }
    });
    console.log('1',trips);  
    
    res.status(200).json({
      status: 'success',
      results: trips.length,
      data: {
        data: trips
      }
    });  
});

exports.getTrip = factory.getOne(Trip, { path: 'booking review' });
exports.getAllTrips = factory.getAll(Trip, { path: 'booking review' });
exports.createTrip = factory.createOne(Trip);

// Do NOT update passwords with this!
exports.updateTrip = factory.updateOne(Trip);
exports.deleteTrip = factory.deleteOne(Trip);
