const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/category/:categoryId', bookController.getBooksByCategory);
router.get('/:id', bookController.getBookById);

// Admin routes (add authentication middleware later)
router.post('/', bookController.createBook);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router;

// Made with Bob