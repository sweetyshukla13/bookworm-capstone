const Coupon = require('../models/Coupon');
const { Op } = require('sequelize');

/**
 * Validate a coupon code and calculate discount
 * @route POST /api/v1/coupons/validate
 */
exports.validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    // Validate input
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code is required'
      });
    }

    if (!orderAmount || orderAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid order amount is required'
      });
    }

    // Find coupon by code (case-insensitive)
    const coupon = await Coupon.findOne({
      where: {
        code: code.toUpperCase()
      }
    });

    // Check if coupon exists
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This coupon is no longer active'
      });
    }

    // Check if coupon has expired
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This coupon has expired'
      });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'This coupon has reached its usage limit'
      });
    }

    // Check minimum order amount
    if (coupon.minOrderAmount && orderAmount < parseFloat(coupon.minOrderAmount)) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required to use this coupon`
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (orderAmount * parseFloat(coupon.discountValue)) / 100;
      
      // Apply max discount cap if exists
      if (coupon.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, parseFloat(coupon.maxDiscountAmount));
      }
    } else if (coupon.discountType === 'fixed') {
      discountAmount = parseFloat(coupon.discountValue);
    }

    // Round discount to 2 decimal places
    discountAmount = Math.round(discountAmount * 100) / 100;

    // Return success response with coupon details
    return res.status(200).json({
      success: true,
      message: 'Coupon applied successfully',
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: parseFloat(coupon.discountValue),
        minOrderAmount: coupon.minOrderAmount ? parseFloat(coupon.minOrderAmount) : null,
        maxDiscountAmount: coupon.maxDiscountAmount ? parseFloat(coupon.maxDiscountAmount) : null,
        expiryDate: coupon.expiryDate,
        isActive: coupon.isActive
      },
      discountAmount
    });

  } catch (error) {
    console.error('Error validating coupon:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while validating the coupon',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all active coupons (optional - for admin or display purposes)
 * @route GET /api/v1/coupons
 */
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { expiryDate: null },
          { expiryDate: { [Op.gte]: new Date() } }
        ]
      },
      order: [['code', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      data: coupons
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching coupons'
    });
  }
};

/**
 * Increment coupon usage count (called after successful order)
 * @route POST /api/v1/coupons/:id/use
 */
exports.incrementCouponUsage = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByPk(id);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // Increment usage count
    await coupon.increment('usageCount');

    return res.status(200).json({
      success: true,
      message: 'Coupon usage recorded'
    });
  } catch (error) {
    console.error('Error incrementing coupon usage:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while recording coupon usage'
    });
  }
};

module.exports = exports;

// Made with Bob
