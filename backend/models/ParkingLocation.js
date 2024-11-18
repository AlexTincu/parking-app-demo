const mongoose = require('mongoose');

const parkingLocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  capacity: { type: Number, required: true },
  hourlyRate: { type: Number, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
});

module.exports = mongoose.model('ParkingLocation', parkingLocationSchema);
