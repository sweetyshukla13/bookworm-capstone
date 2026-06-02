const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');

// All order routes require authentication
router.use(authenticateToken);

// Get all orders for the authenticated user
router.get('/', orderController.getUserOrders);

// Get a specific order by ID
router.get('/:id', orderController.getOrderById);

// Create a new order
router.post('/', orderController.createOrder);

// Update order status (cancel order)
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;

// Made with Bob