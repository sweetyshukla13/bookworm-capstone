const express = require('express');
const router = express.Router();
const { Book, Category } = require('../models');

// Health check for API
router.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Get all books
router.get('/books', async (req, res) => {
  try {
    const books = await Book.findAll({
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'description']
      }],
      order: [['title', 'ASC']]
    });

    res.json({
      status: 'success',
      message: 'Books retrieved successfully',
      data: books
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch books',
      error: error.message
    });
  }
});

// Get book by ID
router.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'description']
      }]
    });

    if (!book) {
      return res.status(404).json({
        status: 'error',
        message: 'Book not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Book retrieved successfully',
      data: book
    });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch book',
      error: error.message
    });
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });

    res.json({
      status: 'success',
      message: 'Categories retrieved successfully',
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

module.exports = router;

// Made with Bob
