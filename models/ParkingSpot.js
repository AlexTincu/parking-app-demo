const mongoose = require('mongoose');

const parkingSpotSchema = new mongoose.Schema({
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingLocation', required: true },
  spotNumber: { type: Number, required: true },
  isOccupied: { type: Boolean, default: false },
  isReserved: { type: Boolean, default: false },
  type: { type: String, enum: ['compact', 'handicap', 'regular'], required: true },
});

module.exports = mongoose.model('ParkingSpot', parkingSpotSchema);
