const { Review, User, Book } = require('../models');

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { bookId, rating, title, comment } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!bookId || !rating || !title || !comment) {
      return res.status(400).json({
        status: 'error',
        message: 'Book ID, rating, title, and comment are required'
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        status: 'error',
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if book exists
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({
        status: 'error',
        message: 'Book not found'
      });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      where: { userId, bookId }
    });

    if (existingReview) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already reviewed this book'
      });
    }

    // Create review
    const review = await Review.create({
      userId,
      bookId,
      rating,
      title,
      comment,
      isVerifiedPurchase: false // Can be updated based on order history
    });

    // Fetch the created review with user details
    const createdReview = await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json({
      status: 'success',
      message: 'Review created successfully',
      data: createdReview
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create review',
      error: error.message
    });
  }
};

// Get all reviews for a book
exports.getBookReviews = async (req, res) => {
  try {
    const { bookId } = req.params;

    const reviews = await Review.findAll({
      where: { bookId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      status: 'success',
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

// Get user's reviews
exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;

    const reviews = await Review.findAll({
      where: { userId },
      include: [
        {
          model: Book,
          as: 'book',
          attributes: ['id', 'title', 'author', 'coverImage']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      status: 'success',
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user reviews',
      error: error.message
    });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    // Check if user owns this review
    if (review.userId !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only update your own reviews'
      });
    }

    // Update review
    await review.update({
      rating: rating || review.rating,
      title: title || review.title,
      comment: comment || review.comment
    });

    const updatedReview = await Review.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ]
    });

    res.json({
      status: 'success',
      message: 'Review updated successfully',
      data: updatedReview
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update review',
      error: error.message
    });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    // Check if user owns this review
    if (review.userId !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only delete your own reviews'
      });
    }

    await review.destroy();

    res.json({
      status: 'success',
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete review',
      error: error.message
    });
  }
};

// Made with Bob