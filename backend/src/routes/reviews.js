const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken } = require('../middleware/auth');

// All review routes require authentication
router.use(authenticateToken);

// Create a new review
router.post('/', reviewController.createReview);

// Get all reviews for a specific book
router.get('/book/:bookId', reviewController.getBookReviews);

// Get current user's reviews
router.get('/my-reviews', reviewController.getUserReviews);

// Update a review
router.put('/:id', reviewController.updateReview);

// Delete a review
router.delete('/:id', reviewController.deleteReview);

module.exports = router;

// Made with Bob