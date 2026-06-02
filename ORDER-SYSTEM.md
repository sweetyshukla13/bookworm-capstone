# Order System - Complete Guide

## Overview

This comprehensive guide covers the complete order system in the Book Worm application, including order creation, order history, payment flow, and the "Buy Again" feature.

---

## Table of Contents

1. [Order Flow](#order-flow)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Frontend Implementation](#frontend-implementation)
5. [Order History](#order-history)
6. [Buy Again Feature](#buy-again-feature)
7. [Testing Guide](#testing-guide)
8. [Troubleshooting](#troubleshooting)

---

## Order Flow

### Complete Flow Diagram

```
User browses books
    ↓
Add books to cart
    ↓
View cart & apply coupons (optional)
    ↓
Proceed to payment page
    ↓
Fill shipping address
    ↓
Select payment method
    ↓
Click "Pay Now"
    ↓
Backend creates address record
    ↓
Backend creates order record
    ↓
Backend creates order items
    ↓
Cart is cleared
    ↓
Navigate to success page
    ↓
View order in "My Orders"
```

### Step-by-Step Process

1. **Cart Management** - Users add books to cart (stored in localStorage)
2. **Payment Page** - Users enter shipping address and payment details
3. **Address Creation** - Backend creates/uses shipping address
4. **Order Creation** - Backend creates order with all items
5. **Order Items** - Backend creates individual order items
6. **Confirmation** - User redirected to success page
7. **Order History** - Order appears in "My Orders" page

---

## Database Schema

### Tables Involved

#### 1. `addresses` Table
```sql
CREATE TABLE addresses (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  full_name VARCHAR(255) NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) DEFAULT 'India',
  phone_number VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. `orders` Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address_id UUID REFERENCES addresses(id),
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. `order_items` Table
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  book_id UUID REFERENCES books(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Order Status Values
- `pending` - Order created, awaiting processing
- `processing` - Order is being prepared
- `shipped` - Order has been shipped
- `delivered` - Order delivered to customer
- `cancelled` - Order cancelled by user

### Payment Status Values
- `pending` - Payment not yet processed
- `completed` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

---

## API Endpoints

### Address Endpoints

**Base URL:** `/api/v1/addresses`

#### Create Address
```http
POST /api/v1/addresses
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "John Doe",
  "addressLine1": "123 Main Street",
  "addressLine2": "Apt 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postalCode": "400001",
  "country": "India",
  "phoneNumber": "9876543210"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Address created successfully",
  "data": {
    "id": "uuid-here",
    "userId": "user-uuid",
    "fullName": "John Doe",
    ...
  }
}
```

#### Get All Addresses
```http
GET /api/v1/addresses
Authorization: Bearer <token>
```

#### Get Address by ID
```http
GET /api/v1/addresses/:id
Authorization: Bearer <token>
```

#### Update Address
```http
PUT /api/v1/addresses/:id
Authorization: Bearer <token>
```

#### Delete Address
```http
DELETE /api/v1/addresses/:id
Authorization: Bearer <token>
```

### Order Endpoints

**Base URL:** `/api/v1/orders`

#### Create Order
```http
POST /api/v1/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "bookId": "book-uuid",
      "quantity": 2,
      "price": 499.00
    }
  ],
  "shippingAddressId": "address-uuid",
  "paymentMethod": "credit",
  "totalAmount": 1098.00,
  "notes": "Coupon applied: SAVE20"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Order created successfully",
  "data": {
    "id": "order-uuid",
    "userId": "user-uuid",
    "orderNumber": "ORD-1234567890-ABC123",
    "status": "processing",
    "totalAmount": 1098.00,
    "paymentMethod": "credit",
    "paymentStatus": "completed",
    "items": [...],
    "shippingAddress": {...},
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get All User Orders
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
      "items": [...],
      "shippingAddress": {...}
    }
  ]
}
```

#### Get Order by ID
```http
GET /api/v1/orders/:id
Authorization: Bearer <token>
```

#### Cancel Order
```http
PATCH /api/v1/orders/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "cancelled"
}
```

---

## Frontend Implementation

### Payment Component

**File:** `src/app/pages/payment/payment.component.ts`

#### Key Features
- Shipping address form
- Payment method selection (Credit Card, Debit Card, UPI, Wallet)
- Coupon code application
- Order summary display
- Order creation after payment

#### Process Payment Flow
```typescript
processPayment(): void {
  // 1. Validate shipping address
  if (!this.validateAddress()) {
    alert('Please fill in all shipping address fields');
    return;
  }

  // 2. Validate cart
  if (cart.length === 0) {
    alert('Your cart is empty');
    return;
  }

  // 3. Create shipping address via API
  this.addressService.createAddress(addressData).subscribe({
    next: (response) => {
      // 4. Create order with address ID
      this.createOrder(response.data.id);
    }
  });
}

private createOrder(addressId: string): void {
  const orderData = {
    items: cart.map(item => ({
      bookId: item.id,
      quantity: item.quantity || 1,
      price: item.price
    })),
    shippingAddressId: addressId,
    paymentMethod: this.getPaymentMethodName(),
    totalAmount: summary.finalTotal,
    notes: this.appliedCoupon() ? `Coupon applied: ${this.appliedCoupon()?.code}` : undefined
  };

  this.orderService.createOrder(orderData).subscribe({
    next: (response) => {
      this.bookService.clearCart();
      this.router.navigate(['/payment-success'], {
        queryParams: { orderId: response.data.id }
      });
    }
  });
}
```

### Order Service

**File:** `src/app/services/order.service.ts`

#### Key Methods
- `getUserOrders()` - Fetch all user orders
- `getOrderById(id)` - Fetch specific order
- `createOrder(data)` - Create new order
- `cancelOrder(id)` - Cancel order
- Helper methods for status colors and formatting

---

## Order History

### Features

1. **Order List View**
   - Display all orders sorted by date (newest first)
   - Order number, status, date, total amount
   - Number of items in each order
   - Expandable order details

2. **Order Details**
   - All order items with book information
   - Shipping address
   - Payment information
   - Order notes
   - Cancel button (for non-delivered orders)

3. **Order Status Badges**
   - Color-coded status indicators
   - Payment status display
   - Visual feedback for order state

4. **Empty State**
   - Friendly message when no orders exist
   - "Browse Books" button to start shopping

### Component Structure

**File:** `src/app/pages/order-history/order-history.component.ts`

```typescript
export class OrderHistoryComponent implements OnInit {
  orders = signal<Order[]>([]);
  loading = signal(true);
  expandedOrderId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getUserOrders().subscribe({
      next: (response) => {
        this.orders.set(response.data);
        this.loading.set(false);
      }
    });
  }

  toggleOrderDetails(orderId: string): void {
    this.expandedOrderId.set(
      this.expandedOrderId() === orderId ? null : orderId
    );
  }

  cancelOrder(orderId: string): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          this.loadOrders();
        }
      });
    }
  }
}
```

---

## Buy Again Feature

### Overview

The "Buy Again" feature allows users to quickly re-order items from previous orders with a single click.

### Features

#### 1. Individual Item "Buy Again"
- **Location:** Next to each item in order details
- **Functionality:** Adds exact quantity of that item to cart
- **Visual:** Green button with shopping cart icon
- **Confirmation:** Shows success message with item name and quantity

#### 2. Order-Level "Buy All Items Again"
- **Location:** At bottom of expanded order details
- **Functionality:** Adds all items from order to cart with original quantities
- **Visual:** Large green button with shopping cart icon
- **Confirmation:** Asks for confirmation before adding all items
- **Result:** Shows summary of successfully added items

### Implementation

```typescript
buyItemAgain(item: OrderItem): void {
  // Fetch latest book details
  this.bookService.getBookById(item.bookId).subscribe({
    next: (response) => {
      const book = response.data;
      // Add to cart with original quantity
      this.bookService.addToCart(book);
      this.bookService.updateQuantity(book.id, item.quantity);
      alert(`✓ Added ${item.quantity} x "${book.title}" to cart!`);
    },
    error: () => {
      alert('Failed to add item to cart. Please try again.');
    }
  });
}

buyOrderAgain(order: Order): void {
  if (!confirm(`Add all ${order.items?.length} item(s) to cart?`)) {
    return;
  }

  let successCount = 0;
  let failCount = 0;

  order.items?.forEach((item, index) => {
    this.bookService.getBookById(item.bookId).subscribe({
      next: (response) => {
        this.bookService.addToCart(response.data);
        this.bookService.updateQuantity(response.data.id, item.quantity);
        successCount++;
        
        // Show result after last item
        if (index === order.items!.length - 1) {
          this.showBuyAgainResult(successCount, failCount);
        }
      },
      error: () => {
        failCount++;
        if (index === order.items!.length - 1) {
          this.showBuyAgainResult(successCount, failCount);
        }
      }
    });
  });
}
```

### User Experience

**Success Messages:**
- Single item: `✓ Added 2 x "The Great Gatsby" to cart!`
- All items (success): `✓ Successfully added all 5 item(s) to cart!`
- Partial success: `⚠ Added 3 item(s) to cart. 2 item(s) failed.`

**Error Handling:**
- Book not available: "Book information not available"
- Book not found: Skips item, continues with others
- API error: "Failed to add item to cart. Please try again."

---

## Testing Guide

### Test Order Creation

1. **Add Items to Cart**
   - Browse books on home page
   - Click "Add to Cart" on any book
   - Verify cart icon shows item count

2. **View Cart**
   - Click cart icon in header
   - Verify items are displayed
   - Adjust quantities if needed
   - Apply coupon code (optional)
   - Click "Proceed to Checkout"

3. **Complete Payment**
   - Fill in shipping address:
     - Full Name: "John Doe"
     - Phone: "9876543210"
     - Address Line 1: "123 Main Street"
     - City: "Mumbai"
     - State: "Maharashtra"
     - Postal Code: "400001"
   - Select payment method (e.g., Credit Card)
   - Click "Pay Now"
   - Wait for processing (shows spinner)

4. **Verify Order Creation**
   - Check browser console for success message
   - Verify navigation to payment success page
   - Cart should be empty

5. **View Order History**
   - Click "My Orders" in header
   - Verify new order appears at top
   - Click to expand order details
   - Verify all items are listed correctly
   - Check order status and payment status

### Test Buy Again Feature

1. **Buy Single Item**
   - Go to Order History
   - Expand any order
   - Click "Buy Again" on an item
   - Verify item added to cart
   - Check cart count increased
   - Verify success message displayed

2. **Buy All Items**
   - Go to Order History
   - Expand an order with multiple items
   - Click "Buy All Items Again"
   - Confirm the action
   - Verify all items added to cart
   - Check cart count increased by total quantity
   - Verify success message with count

3. **Error Handling**
   - Try buying from order with unavailable books
   - Verify appropriate error message
   - Check that available items were still added
   - Verify partial success message if applicable

### Test Order Cancellation

1. Navigate to Order History
2. Expand a non-delivered order
3. Click "Cancel Order"
4. Confirm cancellation
5. Verify order status changes to "cancelled"
6. Verify cancel button is no longer available

---

## Troubleshooting

### Orders Not Appearing in History

**Problem:** After checkout, orders don't show in "My Orders"

**Solutions:**
- Check browser console for API errors
- Verify backend is running (`npm run dev` in backend folder)
- Check database connection
- Verify JWT token is valid (try logging out and back in)
- Check Network tab for failed API calls

### Address Creation Fails

**Problem:** Error when creating shipping address

**Solutions:**
- Ensure all required fields are filled
- Check backend logs for validation errors
- Verify addresses table exists in database
- Check user authentication token
- Verify API endpoint is accessible

### Cart Not Clearing After Order

**Problem:** Cart items remain after successful order

**Solutions:**
- Check if `clearCart()` is called after order creation
- Verify localStorage is accessible
- Check browser console for errors
- Clear browser cache and try again

### Buy Again Not Working

**Problem:** Items not added to cart when clicking "Buy Again"

**Solutions:**
- Check if books still exist in database
- Verify book API endpoint is working
- Check browser console for errors
- Ensure cart service is properly initialized
- Try refreshing the page

### Order Status Not Updating

**Problem:** Order status doesn't change after cancellation

**Solutions:**
- Refresh the order history page
- Check backend logs for update errors
- Verify order is not already delivered
- Check database for status update
- Ensure API endpoint is working

---

## Security

- All endpoints require JWT authentication
- Users can only view their own orders
- Order cancellation restricted to non-delivered orders
- User ID automatically extracted from JWT token
- Address data validated on backend
- Payment information handled securely

---

## Related Files

### Backend
- Controller: `backend/src/controllers/orderController.js`
- Routes: `backend/src/routes/orders.js`
- Models: `backend/src/models/Order.js`, `backend/src/models/OrderItem.js`, `backend/src/models/Address.js`

### Frontend
- Service: `src/app/services/order.service.ts`
- Component: `src/app/pages/order-history/order-history.component.ts`
- Model: `src/app/models/order.model.ts`
- Payment Component: `src/app/pages/payment/payment.component.ts`

---

**Made with Bob** 🤖