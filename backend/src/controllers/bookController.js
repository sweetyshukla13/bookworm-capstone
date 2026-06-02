const { Book, Category } = require('../models');

// Get all books with optional filtering
exports.getAllBooks = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, language, format } = req.query;
    
    let whereClause = {};
    
    if (category) {
      whereClause.categoryId = category;
    }
    
    if (search) {
      const { Op } = require('sequelize');
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { author: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    if (minPrice || maxPrice) {
      const { Op } = require('sequelize');
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = minPrice;
      if (maxPrice) whereClause.price[Op.lte] = maxPrice;
    }
    
    if (language) {
      whereClause.language = language;
    }
    
    if (format) {
      whereClause.format = format;
    }
    
    const books = await Book.findAll({
      where: whereClause,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }],
      order: [['title', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: books
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch books',
      error: error.message
    });
  }
};

// Get single book by ID
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const book = await Book.findByPk(id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }]
    });
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch book',
      error: error.message
    });
  }
};

// Create new book (admin only)
exports.createBook = async (req, res) => {
  try {
    const bookData = req.body;
    
    const book = await Book.create(bookData);
    
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book
    });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create book',
      error: error.message
    });
  }
};

// Update book (admin only)
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const bookData = req.body;
    
    const book = await Book.findByPk(id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    await book.update(bookData);
    
    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book
    });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update book',
      error: error.message
    });
  }
};

// Delete book (admin only)
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    
    const book = await Book.findByPk(id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    await book.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete book',
      error: error.message
    });
  }
};

// Get books by category
exports.getBooksByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    const books = await Book.findAll({
      where: { categoryId },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }],
      order: [['title', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: books
    });
  } catch (error) {
    console.error('Error fetching books by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch books by category',
      error: error.message
    });
  }
};

// Made with Bob