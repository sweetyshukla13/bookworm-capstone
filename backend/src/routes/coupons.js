const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');

/**
 * @route   POST /api/v1/coupons/validate
 * @desc    Validate a coupon code and calculate discount
 * @access  Public
 */
router.post('/validate', couponController.validateCoupon);

/**
 * @route   GET /api/v1/coupons
 * @desc    Get all active coupons
 * @access  Public
 */
router.get('/', couponController.getAllCoupons);

/**
 * @route   POST /api/v1/coupons/:id/use
 * @desc    Increment coupon usage count
 * @access  Private (should be called after successful order)
 */
router.post('/:id/use', couponController.incrementCouponUsage);

module.exports = router;

// Made with Bob
