const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { authenticateToken } = require('../middleware/auth');

// All wishlist routes require authentication
router.use(authenticateToken);

// Get user's wishlist
router.get('/', wishlistController.getUserWishlist);

// Add book to wishlist
router.post('/', wishlistController.addToWishlist);

// Check if book is in wishlist
router.get('/check/:bookId', wishlistController.checkWishlistStatus);

// Remove book from wishlist
router.delete('/:bookId', wishlistController.removeFromWishlist);

// Clear entire wishlist
router.delete('/', wishlistController.clearWishlist);

module.exports = router;

// Made with Bob