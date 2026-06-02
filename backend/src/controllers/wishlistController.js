const { Wishlist, Book, User } = require('../models');

// Get all wishlist items for a user
exports.getUserWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlistItems = await Wishlist.findAll({
      where: { userId },
      include: [
        {
          model: Book,
          as: 'book',
          attributes: ['id', 'title', 'author', 'price', 'originalPrice', 'coverImage', 'rating', 'inStock']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      status: 'success',
      message: 'Wishlist retrieved successfully',
      data: wishlistItems
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch wishlist',
      error: error.message
    });
  }
};

// Add book to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({
        status: 'error',
        message: 'Book ID is required'
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

    // Check if already in wishlist
    const existingItem = await Wishlist.findOne({
      where: { userId, bookId }
    });

    if (existingItem) {
      return res.status(400).json({
        status: 'error',
        message: 'Book already in wishlist'
      });
    }

    // Add to wishlist
    const wishlistItem = await Wishlist.create({
      userId,
      bookId
    });

    // Fetch complete wishlist item with book details
    const completeItem = await Wishlist.findByPk(wishlistItem.id, {
      include: [
        {
          model: Book,
          as: 'book',
          attributes: ['id', 'title', 'author', 'price', 'originalPrice', 'coverImage', 'rating', 'inStock']
        }
      ]
    });

    res.status(201).json({
      status: 'success',
      message: 'Book added to wishlist',
      data: completeItem
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add to wishlist',
      error: error.message
    });
  }
};

// Remove book from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.params;

    const wishlistItem = await Wishlist.findOne({
      where: { userId, bookId }
    });

    if (!wishlistItem) {
      return res.status(404).json({
        status: 'error',
        message: 'Book not found in wishlist'
      });
    }

    await wishlistItem.destroy();

    res.json({
      status: 'success',
      message: 'Book removed from wishlist'
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to remove from wishlist',
      error: error.message
    });
  }
};

// Check if book is in wishlist
exports.checkWishlistStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.params;

    const wishlistItem = await Wishlist.findOne({
      where: { userId, bookId }
    });

    res.json({
      status: 'success',
      data: {
        inWishlist: !!wishlistItem
      }
    });
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to check wishlist status',
      error: error.message
    });
  }
};

// Clear entire wishlist
exports.clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    await Wishlist.destroy({
      where: { userId }
    });

    res.json({
      status: 'success',
      message: 'Wishlist cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to clear wishlist',
      error: error.message
    });
  }
};

module.exports = exports;

// Made with Bob