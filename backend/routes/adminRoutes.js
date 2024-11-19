const express = require('express');
const adminController = require('../controllers/adminController');
const { auth, admin } = require('../middleware/auth');
const validate = require('../middleware/validate');
const ParkingLocation = require('../models/ParkingLocation')

const { body, param, query, check} = require("express-validator");

const router = express.Router();

// Get all parking location
router.get('/locations', auth, admin, adminController.getParkingLocations);

// Delete a location
router.delete('/locations/:id', auth, admin, 
  [param('id').isMongoId().withMessage('Valid location ID is required')],
  validate,
  adminController.deleteLocation); 

// Add a new parking location
router.post('/locations', auth, admin, 
    [
        body('name').isString().notEmpty().withMessage('Location name is required'),
        body('address').isString().notEmpty().withMessage('Address is required'),
        body('capacity').isInt({ min: 1 }).withMessage('Total spots must be a positive integer'),
        body('hourlyRate')
        .notEmpty().withMessage('Hourly rate is required')
        .isFloat({ min: 0 }).withMessage('Price per hour must be a non-negative number'),
        body('latitude').isFloat({ min: 2 }).withMessage('Latitude must be a number'),
        body('longitude').isFloat({ min: 2 }).withMessage('Longitude must be a number'),
        check("longitude").custom(async (latitude) => {
          const existingLocation = await ParkingLocation.findOne({ latitude });
          if (existingLocation) {
            throw new Error("Location already exists");
          }
        }),
    ],
    validate,
    adminController.addLocation);

// Update pricing for a parking location
router.put('/locations/:id/pricing', auth, admin, [
    param('id').isMongoId().withMessage('Valid location ID is required'),
    body('hourlyRate').isFloat({ min: 0 }).withMessage('Price per hour must be a non-negative number'),
  ],
  validate,
  adminController.updatePricing);

  // Get all parking spots for a specified location
router.get('/locations/:locationId/spots', auth, admin, 
  param('locationId').isMongoId().withMessage('Valid location ID is required'),
  validate,
  adminController.getParkingSpotsByLocation);

// Route to create a new parking spot
router.post('/locations/:locationId/spots', auth, admin, [
    param('locationId').isMongoId().withMessage('Valid location ID is required'),    
    body('spotNumber').isInt().withMessage('Spot number must be a non-negative number').notEmpty().withMessage('Spot number is required'),
    body('type').isIn(['compact', 'handicapped', 'regular']).withMessage('Type must be one of: compact, handicap, regular'),
    body('status').optional().isIn(['available', 'reserved']).withMessage('Status must be either "available" or "reserved"'),
  ],
  validate,
  adminController.addParkingSpot);

// Route to create a new parking spot
router.delete('/locations/:locationId/spots/:spotId/', auth, admin, [
  param('locationId').isMongoId().withMessage('Valid location ID is required'),
  param('spotId').isMongoId().withMessage('Valid spot ID is required')
],
validate,
adminController.deleteParkingSpot);  

router.get('/reservations', auth, admin, adminController.viewReservations);

// Route to track revenue
router.get('/revenue', auth, admin,  [
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid ISO 8601 date'),
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid ISO 8601 date'),
  ],
  validate,
  adminController.trackRevenue);

module.exports = router;
