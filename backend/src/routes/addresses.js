const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { authenticateToken } = require('../middleware/auth');

// All address routes require authentication
router.use(authenticateToken);

// Create a new address
router.post('/', addressController.createAddress);

// Get all addresses for the authenticated user
router.get('/', addressController.getUserAddresses);

// Get a specific address by ID
router.get('/:id', addressController.getAddressById);

// Update an address
router.put('/:id', addressController.updateAddress);

// Delete an address
router.delete('/:id', addressController.deleteAddress);

module.exports = router;

// Made with Bob