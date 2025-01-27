const mongoose = require('mongoose');

const parkingLocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  capacity: { type: Number, required: true },
  availableSpots: { type: Number, required: true },
  hourlyRate: { type: Number, required: true },  
  // Geospatial field for location (latitude, longitude)
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },

  // latitude: { type: Number },
  // longitude: { type: Number },
});

parkingLocationSchema.index('name');

// Create a 2dsphere index for location
parkingLocationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('ParkingLocation', parkingLocationSchema);
