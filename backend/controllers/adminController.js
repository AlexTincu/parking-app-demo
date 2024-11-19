const ParkingLocation = require("../models/ParkingLocation");
const ParkingSpot = require("../models/ParkingSpot");
const Reservation = require("../models/Reservation");
const { escape } = require('validator');

// Get parking locations
const getParkingLocations = async (req, res) => {
  try {
    const searchParam = escape(req.query.search) || '';
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 locations per page
    const skip = (page - 1) * limit;

    // const locations = await ParkingLocation.find().skip(skip).limit(limit);

    // Aggregation pipeline
    const locations = await ParkingLocation.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: searchParam, $options: 'i' } }, // case-insensitive search in the name field
            { address: { $regex: searchParam, $options: 'i' } } // case-insensitive search in the address field
          ]
        }
      },
      // Step 1: Match all locations with pagination
      { $skip: skip },
      { $limit: limit },

      // Step 2: Use $lookup to join with ParkingSpot collection
      {
        $lookup: {
          from: "parkingspots", // Name of the ParkingSpot collection
          localField: "_id",
          foreignField: "locationId",
          as: "spots",
        },
      },

      // Step 3: Use $addFields to calculate the count of occupied spots
      {
        $addFields: {
          occupiedSpots: {
            $size: {
              $filter: {
                input: "$spots",
                as: "spot",
                cond: { $eq: ["$$spot.isOccupied", true] }, // Count only occupied spots
              },
            },
          },
        },
      },

      // Step 4: Clean up the data to only include necessary fields
      {
        $project: {
          spots: 0, // Exclude the joined spots array to reduce payload size
        },
      },
    ]);

    const totalLocations = await ParkingLocation.countDocuments();
    const totalPages = Math.ceil(totalLocations / limit);

    res.json({
      locations,
      totalLocations,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Delete a location
const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ParkingLocation.findByIdAndDelete(id);
    
    if (!result) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.status(200).json({ message: 'Location deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
// Add a new parking location
const addLocation = async (req, res) => {
  try {
    const { name, address, capacity, hourlyRate, latitude, longitude } =
      req.body;

    const newLocation = new ParkingLocation({
      name,
      address,
      capacity,
      hourlyRate,
      latitude,
      longitude,
    });

    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Update pricing for a parking location
const updatePricing = async (req, res) => {
  try {
    const { id } = req.params;
    const { hourlyRate } = req.body;

    const location = await ParkingLocation.findByIdAndUpdate(id, {hourlyRate});

    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    location.hourlyRate = +hourlyRate;

    res.json(location);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Add a new parking spot
const addParkingSpot = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { spotNumber, type } = req.body;

    const newSpot = new ParkingSpot({ locationId, spotNumber, type });
    await newSpot.save();
    res.status(201).json(newSpot);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Delete a parking spot
const deleteParkingSpot = async (req, res) => {
  try {
    const { locationId, spotId:id } = req.params;
    const result = await ParkingSpot.deleteOne({ id, locationId });

    if (!result) {
      return res.status(404).json({ message: 'Parking spot not found' });
    }

    res.status(200).json({ message: 'Parking spot deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// View all reservations
const viewReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("userId", "name email")
      .populate("spotId", "spotNumber locationId");
    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Track revenue
const trackRevenue = async (req, res) => {
  try {
    const reservations = await Reservation.find({ status: "completed" });
    const totalRevenue = reservations.reduce(
      (acc, reservation) => acc + reservation.totalAmount,
      0
    );

    res.json({ totalRevenue });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Get all parking spots for a specified location with pagination
const getParkingSpotsByLocation = async (req, res) => {
  try {
    const { locationId } = req.params;
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 spots per page
    const skip = (page - 1) * limit;

    const spots = await ParkingSpot.find({ locationId })
      .skip(skip)
      .limit(limit);

    const totalSpots = await ParkingSpot.countDocuments({ locationId });
    const totalPages = Math.ceil(totalSpots / limit);

    if (!spots.length) {
      return res.status(404).json({ message: "No spots found for this location" });
    }

    res.json({
      spots,
      totalSpots,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Export all methods as a single object
module.exports = {
  getParkingLocations,
  addLocation,
  updatePricing,
  deleteLocation,
  addParkingSpot,
  deleteParkingSpot,
  viewReservations,
  trackRevenue,
  getParkingSpotsByLocation,
};
