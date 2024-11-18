const Reservation = require('../models/Reservation');
const ParkingSpot = require('../models/ParkingSpot');

// Reserve a parking spot
exports.reserveSpot = async (req, res) => {
  const { userId, spotId, startTime, endTime } = req.body;
  try {
    const spot = await ParkingSpot.findById(spotId);
    if (spot.isReserved) return res.status(400).json({ message: 'Spot already reserved' });

    const totalAmount = (new Date(endTime) - new Date(startTime)) / 3600000 * spot.hourlyRate;
    const reservation = new Reservation({ userId, spotId, startTime, endTime, totalAmount, status: 'pending' });

    spot.isReserved = true;
    await spot.save();
    await reservation.save();

    res.status(201).json({ message: 'Reservation created successfully', reservation });
  } catch (err) {
    res.status(500).json({ message: 'Error reserving spot.', error: err });
  }
};
