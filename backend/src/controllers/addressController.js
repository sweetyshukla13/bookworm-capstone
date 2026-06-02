const { Address } = require('../models');

// Create a new address
exports.createAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, addressLine1, addressLine2, city, state, postalCode, country, phoneNumber } = req.body;

    const address = await Address.create({
      userId,
      fullName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country: country || 'India',
      phone: phoneNumber  // Map phoneNumber to phone field
    });

    res.status(201).json({
      status: 'success',
      message: 'Address created successfully',
      data: address
    });
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create address',
      error: error.message
    });
  }
};

// Get all addresses for a user
exports.getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await Address.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      status: 'success',
      message: 'Addresses retrieved successfully',
      data: addresses
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch addresses',
      error: error.message
    });
  }
};

// Get a specific address by ID
exports.getAddressById = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const address = await Address.findOne({
      where: { 
        id: addressId,
        userId 
      }
    });

    if (!address) {
      return res.status(404).json({
        status: 'error',
        message: 'Address not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Address retrieved successfully',
      data: address
    });
  } catch (error) {
    console.error('Error fetching address:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch address',
      error: error.message
    });
  }
};

// Update an address
exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;
    const { fullName, addressLine1, addressLine2, city, state, postalCode, country, phoneNumber } = req.body;

    const address = await Address.findOne({
      where: { 
        id: addressId,
        userId 
      }
    });

    if (!address) {
      return res.status(404).json({
        status: 'error',
        message: 'Address not found'
      });
    }

    await address.update({
      fullName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      phoneNumber
    });

    res.json({
      status: 'success',
      message: 'Address updated successfully',
      data: address
    });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update address',
      error: error.message
    });
  }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const address = await Address.findOne({
      where: { 
        id: addressId,
        userId 
      }
    });

    if (!address) {
      return res.status(404).json({
        status: 'error',
        message: 'Address not found'
      });
    }

    await address.destroy();

    res.json({
      status: 'success',
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete address',
      error: error.message
    });
  }
};

// Made with Bob