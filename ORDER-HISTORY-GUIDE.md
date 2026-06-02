# Order History Feature - Implementation Guide

## Overview

The Order History feature allows users to view all their past orders, including order details, items purchased, shipping information, and order status. Users can also cancel orders that haven't been delivered yet.

## Features Implemented

### Backend (Node.js/Express + Sequelize)

1. **Order Controller** (`backend/src/controllers/orderController.js`)
   - `getUserOrders()` - Fetch all orders for authenticated user
   - `getOrderById()` - Fetch specific order details
   - `createOrder()` - Create new order
   - `updateOrderStatus()` - Cancel orders

2. **Order Routes** (`backend/src/routes/orders.js`)
   - `GET /api/v1/orders` - Get all user orders
   - `GET /api/v1/orders/:id` - Get specific order
   - `POST /api/v1/orders` - Create new order
   - `PATCH /api/v1/orders/:id/status` - Update order status

3. **Authentication**
   - All order routes require JWT authentication
   - Uses `authenticateToken` middleware

### Frontend (Angular)

1. **Order Model** (`src/app/models/order.model.ts`)
   - Order interface with all fields
   - OrderItem interface for order items
   - ShippingAddress interface
   - CreateOrderRequest interface

2. **Order Service** (`src/app/services/order.service.ts`)
   - `getUserOrders()` - Fetch user orders
   - `getOrderById()` - Fetch specific order
   - `createOrder()` - Create new order
   - `cancelOrder()` - Cancel order
   - Helper methods for status colors and formatting

3. **Order History Component** (`src/app/pages/order-history/`)
   - Displays list of all orders
   - Expandable order details
   - Order item display with book information
   - Shipping address display
   - Payment information
   - Cancel order functionality
   - Responsive design with Tailwind CSS

4. **Navigation**
   - Added route `/orders` in app routes
   - Updated header "My Orders" link to navigate to order history

## API Endpoints

### Get All Orders
```http
GET /api/v1/orders
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "message": "Orders retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "orderNumber": "ORD-1234567890-ABC123",
      "status": "processing",
      "totalAmount": "299.99",
      "paymentStatus": "completed",
      "paymentMethod": "Credit Card",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "orderItems": [...],
      "shippingAddress": {...}
    }
  ]
}
```

### Get Order by ID
```http
GET /api/v1/orders/:id
Authorization: Bearer <token>
```

### Create Order
```http
POST /api/v1/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "bookId": "uuid",
      "quantity": 2,
      "price": 29.99
    }
  ],
  "shippingAddressId": "uuid",
  "paymentMethod": "Credit Card",
  "totalAmount": 59.98,
  "notes": "Optional notes"
}
```

### Cancel Order
```http
PATCH /api/v1/orders/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "cancelled"
}
```

## Order Status Flow

1. **pending** - Order created, awaiting processing
2. **processing** - Order is being prepared
3. **shipped** - Order has been shipped
4. **delivered** - Order delivered to customer
5. **cancelled** - Order cancelled by user

## Payment Status

1. **pending** - Payment not yet processed
2. **completed** - Payment successful
3. **failed** - Payment failed
4. **refunded** - Payment refunded

## Usage Instructions

### For Users

1. **View Order History**
   - Click "My Orders" in the header navigation
   - See list of all your orders sorted by date (newest first)

2. **View Order Details**
   - Click "View Details" on any order
   - See complete order information including:
     - Order items with book details
     - Shipping address
     - Payment information
     - Order notes (if any)

3. **Cancel Order**
   - Expand order details
   - Click "Cancel Order" button (only available for non-delivered orders)
   - Confirm cancellation

4. **Track Order**
   - Click "Track Order" button (feature placeholder)

### For Developers

#### Adding Order History to Payment Flow

After successful payment, create an order:

```typescript
import { OrderService } from './services/order.service';

// In your payment component
createOrderAfterPayment() {
  const orderData = {
    items: this.cartItems.map(item => ({
      bookId: item.bookId,
      quantity: item.quantity,
      price: item.price
    })),
    shippingAddressId: this.selectedAddressId,
    paymentMethod: this.paymentMethod,
    totalAmount: this.totalAmount,
    notes: this.orderNotes
  };

  this.orderService.createOrder(orderData).subscribe({
    next: (response) => {
      console.log('Order created:', response.data);
      // Navigate to order success page
      this.router.navigate(['/payment-success']);
    },
    error: (error) => {
      console.error('Order creation failed:', error);
    }
  });
}
```

#### Customizing Order Display

Modify [`order-history.component.html`](src/app/pages/order-history/order-history.component.html:1) to customize the display.

#### Adding Order Filters

Add filter functionality in [`order-history.component.ts`](src/app/pages/order-history/order-history.component.ts:1):

```typescript
filterOrders(status: string) {
  this.orderService.getUserOrders().subscribe({
    next: (response) => {
      this.orders = response.data.filter(order => 
        status === 'all' || order.status === status
      );
    }
  });
}
```

## Database Schema

The order history feature uses these database tables:

- **orders** - Main order information
- **order_items** - Individual items in each order
- **books** - Book details (joined with order_items)
- **addresses** - Shipping address information

## Security

- All endpoints require JWT authentication
- Users can only view their own orders
- Order cancellation restricted to non-delivered orders
- User ID automatically extracted from JWT token

## Testing

### Test Order Creation
```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"bookId": "uuid", "quantity": 1, "price": 29.99}],
    "shippingAddressId": "uuid",
    "paymentMethod": "Credit Card",
    "totalAmount": 29.99
  }'
```

### Test Get Orders
```bash
curl -X GET http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### Orders Not Showing
- Verify user is authenticated
- Check JWT token is valid
- Ensure orders exist in database for the user

### Cannot Cancel Order
- Check order status (only non-delivered orders can be cancelled)
- Verify user owns the order
- Check authentication token

### Missing Order Details
- Verify database relationships are properly set up
- Check that order includes are working in the query
- Ensure book and address data exists

## Future Enhancements

1. **Order Tracking** - Real-time order tracking
2. **Order Filters** - Filter by status, date range
3. **Order Search** - Search by order number or book title
4. **Reorder** - Quick reorder from past orders
5. **Download Invoice** - PDF invoice generation
6. **Order Reviews** - Leave reviews for delivered orders
7. **Return/Refund** - Request returns for delivered orders

## Related Files

- Backend Controller: [`backend/src/controllers/orderController.js`](backend/src/controllers/orderController.js:1)
- Backend Routes: [`backend/src/routes/orders.js`](backend/src/routes/orders.js:1)
- Frontend Service: [`src/app/services/order.service.ts`](src/app/services/order.service.ts:1)
- Frontend Component: [`src/app/pages/order-history/order-history.component.ts`](src/app/pages/order-history/order-history.component.ts:1)
- Order Model: [`src/app/models/order.model.ts`](src/app/models/order.model.ts:1)

---

**Made with Bob**