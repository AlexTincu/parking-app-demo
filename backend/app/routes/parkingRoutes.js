const express = require("express");
const parkingController = require("../controllers/parkingController");
const { auth } = require("../middleware/auth"); // Auth middleware for protected routes
const { body, query } = require("express-validator");
const validate = require("../middleware/validate");

const router = express.Router();

// Route to get all locations
router.get("/locations", auth, parkingController.getParkingLocations);

// Route to find nearby available parking location
router.get(
  "/locations/nearby",
  [
    query("latitude")
      .notEmpty()
      .isFloat({ min: -90, max: 90 })
      .withMessage("Latitude must be a number between -90 and 90"),
    query("longitude")
      .notEmpty()
      .isFloat({ min: -180, max: 180 })
      .withMessage("Longitude must be a number between -180 and 180"),
  ],
  validate,
  parkingController.findNearbyAvailableParking
);

// Route to get all parking spots
router.get("/spots", auth, parkingController.getParkingSpots);

// Route to find available parking spots
router.get("/find", auth, parkingController.findParking);

// Route to reserve a parking spot
router.post(
  "/reserve",
  auth,
  [
    body("spotId")
      .isMongoId()
      .withMessage("spotId must be a valid MongoDB ObjectId"),
    body("startTime")
      .isISO8601()
      .withMessage(
        "startTime must be a valid ISO 8601 date (e.g., YYYY-MM-DDTHH:MM:SSZ)"
      ),
    body("duration")
      .isInt({ min: 1 })
      .withMessage("Duration must be a positive integer"),
  ],
  validate,
  parkingController.reserveSpot
);

// Route to cancel a reservation
router.delete("/reservation/:id/cancel", auth, parkingController.cancelReservation);

module.exports = router;
