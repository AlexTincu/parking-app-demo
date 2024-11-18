const express = require('express');
const { getParkingLocations, getParkingSpots, findParking, reserveSpot, cancelReservation } = require('../controllers/parkingController');
const { auth } = require('../middleware/auth'); // Auth middleware for protected routes
const { body } = require("express-validator");
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/locations', auth, getParkingLocations);

router.get('/spots', auth, getParkingSpots);

// Route to find available parking spots
router.get('/find', auth, findParking);

// Route to reserve a parking spot
router.post('/reserve', auth, [
    body('spotId').isMongoId().withMessage('spotId must be a valid MongoDB ObjectId'),
    body('startTime')
      .isISO8601()
      .withMessage('startTime must be a valid ISO 8601 date (e.g., YYYY-MM-DDTHH:MM:SSZ)'),
    body('duration')
      .isInt({ min: 1 })
      .withMessage('Duration must be a positive integer'),
  ],
  validate,
  reserveSpot);

// Route to cancel a reservation
router.delete('/reservation/:id/cancel', auth, cancelReservation);

module.exports = router;
