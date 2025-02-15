const ParkingLocation = require('../models/ParkingLocation');
const ParkingSpot = require('../models/ParkingSpot');
const Reservation = require('../models/Reservation');
const moment = require('moment'); 

// Get parking locations
exports.getParkingLocations = async (req, res) => {
  try {
    const locations = await ParkingLocation.find();
    res.status(200).json(locations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching locations.', error: err });
  }
};

exports.findNearbyAvailableParking = async(req, res, next) => {
  try {
    let { latitude, longitude, maxDistance} = req.query;

    // Convert latitude, longitude and maxDistance to numbers
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);
    maxDistance = parseInt(maxDistance) | 1000;

    const closestLocation = await ParkingLocation.find({
      location: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: maxDistance, 
        },
      },
      availableSpots: { $gt: 0 }, // Only locations with available spots
    });

    if (!closestLocation) {
      return res.status(404).json({ message: 'No available parking locations found nearby' });
    }

    res.json(closestLocation);
  } catch (err) {
    console.log(err);
    next(err); // Pass the error to the error handler middleware
  }
}

// Get available parking spots
exports.getParkingSpots = async (req, res) => {
  const { locationId } = req.query;
  try {
    const spots = await ParkingSpot.find({ locationId, isReserved: false, isOccupied: false });
    res.status(200).json(spots);
  } catch (err) {
    next(err);
  }
};

// 1. Find available parking spots
exports.findParking = async (req, res) => {
  const { locationId, date, time, type="regular" } = req.query;

  try {
    // Convert date and time to a Date object for filtering
    const requestedDateTime = new Date(`${date}T${time}`);

    // Find available spots based on location, date, and time
    const availableSpots = await ParkingSpot.find({
      locationId,
      type,
      isOccupied: false,
      isReserved: false,
      reservations: {
        $not: {
          $elemMatch: {
            startTime: { $lt: requestedDateTime },
            endTime: { $gt: requestedDateTime },
          },
        },
      },
    });

    res.json(availableSpots);
  } catch (err) {
    next(err);
  }
};

// 2. Reserve a parking spot
exports.reserveSpot = async (req, res) => {
  const { spotId, startTime, duration } = req.body;
  const userId = req.user.id;

  console.log(spotId, userId, startTime, duration);

  try {
    const parkingSpot = await ParkingSpot.findById(spotId);

    if (!parkingSpot || parkingSpot.isOccupied === true || parkingSpot.isReserved === true) {
      return res.status(400).json({ message: 'Spot is not available' });
    }

    // Calculate end time based on start time and duration
    const endTime = moment(startTime).add(duration, 'hours').toDate();

    // Create reservation
    const newReservation = new Reservation({
      userId,
      spotId,
      startTime,
      endTime,
      totalAmount: duration
    });

    await newReservation.save();

    // Update spot status to reserved
    parkingSpot.isReserved = true;
    await parkingSpot.save();

    res.status(201).json(newReservation);
  } catch (err) {
    next(err);
  }
};

// 3. Cancel a reservation
exports.cancelReservation = async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findById(id);

    if (!reservation || reservation.status !== 'reserved') {
      return res.status(404).json({ message: 'Reservation not found or already canceled' });
    }

    // Check if the cancellation is within the allowed cancellation period
    const cancellationAllowedUntil = moment(reservation.startTime).subtract(1, 'hour'); // Example: 1 hour before start time
    const currentTime = moment();

    if (currentTime.isAfter(cancellationAllowedUntil)) {
      return res.status(400).json({ message: 'Cancellation window has passed. Penalty may apply.' });
    }

    // Update reservation status
    reservation.status = 'canceled';
    await reservation.save();

    // Update spot status back to available
    const parkingSpot = await ParkingSpot.findById(reservation.spotId);
    parkingSpot.status = 'available';
    await parkingSpot.save();

    res.json({ message: 'Reservation canceled successfully' });
  } catch (err) {
    next(err);
  }
};