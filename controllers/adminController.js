const ParkingLocation = require('../models/ParkingLocation');
const ParkingSpot = require('../models/ParkingSpot');
const Reservation = require('../models/Reservation');

// Add a new parking location
exports.addLocation = async (req, res) => {

  try {
    const { name, address, totalSpots, hourlyRate, latitude, longitude } = req.body;

    const newLocation = new ParkingLocation({
      name,
      address,
      totalSpots, 
      hourlyRate,
      latitude,
      longitude,
    });

    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Update pricing for a parking location
exports.updatePricing = async (req, res) => {
  try {
    const { id } = req.params;
    const { hourlyRate } = req.body;

    const location = await ParkingLocation.findByIdAndUpdate(id, { hourlyRate });

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    location.hourlyRate = hourlyRate;

    res.json(location);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Add a new parking location
exports.addParkingSpot = async (req, res) => {
  try {

    const { locationId, spotNumber, type} = req.body;

    const newSpot = new ParkingSpot({locationId, spotNumber, type});
    await newSpot.save();
    res.status(201).json(newSpot);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// View all reservations
exports.viewReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('userId', 'name email').populate('spotId', 'spotNumber locationId');
    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Track revenue
exports.trackRevenue = async (req, res) => {
  try {
    const reservations = await Reservation.find({ status: 'completed' });
    const totalRevenue = reservations.reduce((acc, reservation) => acc + reservation.totalAmount, 0);

    res.json({ totalRevenue });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
