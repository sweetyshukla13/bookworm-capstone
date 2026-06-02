const { Order, OrderItem, Book, Address, User } = require('../models');

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Book,
              as: 'book',
              attributes: ['id', 'title', 'author', 'coverImage', 'price', 'description', 'rating', 'pages', 'publisher']
            }
          ]
        },
        {
          model: Address,
          as: 'shippingAddress',
          attributes: ['id', 'fullName', 'addressLine1', 'addressLine2', 'city', 'state', 'postalCode', 'country']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      status: 'success',
      message: 'Orders retrieved successfully',
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Get a specific order by ID
exports.getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const order = await Order.findOne({
      where: { 
        id: orderId,
        userId 
      },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Book,
              as: 'book',
              attributes: ['id', 'title', 'author', 'coverImage', 'price', 'isbn', 'description', 'rating', 'pages', 'publisher']
            }
          ]
        },
        {
          model: Address,
          as: 'shippingAddress'
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Order retrieved successfully',
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, shippingAddressId, paymentMethod, totalAmount, notes } = req.body;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const order = await Order.create({
      userId,
      orderNumber,
      totalAmount,
      shippingAddressId,
      paymentMethod,
      paymentStatus: 'completed',
      status: 'processing',
      notes
    });

    // Create order items
    const orderItems = await Promise.all(
      items.map(item => 
        OrderItem.create({
          orderId: order.id,
          bookId: item.bookId,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.quantity * item.price
        })
      )
    );

    // Fetch complete order with relations
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Book,
              as: 'book'
            }
          ]
        },
        {
          model: Address,
          as: 'shippingAddress'
        }
      ]
    });

    res.status(201).json({
      status: 'success',
      message: 'Order created successfully',
      data: completeOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;
    const { status } = req.body;

    const order = await Order.findOne({
      where: { 
        id: orderId,
        userId 
      }
    });

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Only allow cancellation by user
    if (status !== 'cancelled') {
      return res.status(403).json({
        status: 'error',
        message: 'You can only cancel orders'
      });
    }

    // Don't allow cancellation of delivered orders
    if (order.status === 'delivered') {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot cancel delivered orders'
      });
    }

    order.status = status;
    await order.save();

    res.json({
      status: 'success',
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

module.exports = exports;

// Made with Bob