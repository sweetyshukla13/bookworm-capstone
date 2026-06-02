# Complete Order Flow Guide

## Overview

This guide explains the complete order flow in the Book Worm application, from adding items to cart through checkout, payment, and viewing order history.

## Flow Diagram

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

## Implementation Details

### 1. Cart Management

**Location**: [`BookService`](src/app/services/book.service.ts)

**Key Methods**:
- `addToCart(book: Book)` - Adds a book to cart
- `removeFromCart(bookId: string)` - Removes a book from cart
- `updateQuantity(bookId: string, quantity: number)` - Updates item quantity
- `clearCart()` - Clears all cart items
- `calculateOrderSummary()` - Calculates subtotal, tax, delivery, discount, and total

**Storage**: Cart items are persisted in `localStorage` with key `bookworm_cart`

### 2. Payment Page

**Location**: [`PaymentComponent`](src/app/pages/payment/payment.component.ts)

**Features**:
- Shipping address form (required fields: fullName, addressLine1, city, state, postalCode, phone)
- Payment method selection (Credit Card, Debit Card, UPI, Wallet)
- Coupon code application
- Order summary display

**Process Flow**:

```typescript
processPayment() {
  // 1. Validate shipping address
  if (!this.fullName || !this.addressLine1 || ...) {
    alert('Please fill in all shipping address fields');
    return;
  }

  // 2. Validate cart
  if (cart.length === 0) {
    alert('Your cart is empty');
    return;
  }

  // 3. Create shipping address via API
  POST /api/v1/addresses
  {
    fullName, addressLine1, addressLine2,
    city, state, postalCode, country, phoneNumber
  }

  // 4. Create order with address ID
  POST /api/v1/orders
  {
    items: [{ bookId, quantity, price }],
    shippingAddressId: addressId,
    paymentMethod: 'credit',
    totalAmount: 1234.56,
    notes: 'Coupon applied: SAVE20'
  }

  // 5. Clear cart and navigate to success page
  this.bookService.clearCart();
  this.router.navigate(['/payment-success']);
}
```

### 3. Backend API Endpoints

#### Address API

**Base URL**: `/api/v1/addresses`

**Endpoints**:
- `POST /` - Create new address (requires authentication)
- `GET /` - Get all user addresses
- `GET /:id` - Get specific address
- `PUT /:id` - Update address
- `DELETE /:id` - Delete address

**Create Address Request**:
```json
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

**Response**:
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

#### Order API

**Base URL**: `/api/v1/orders`

**Endpoints**:
- `POST /` - Create new order (requires authentication)
- `GET /` - Get all user orders
- `GET /:id` - Get specific order
- `PATCH /:id/status` - Update order status (cancel only)

**Create Order Request**:
```json
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

**Response**:
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

### 4. Database Schema

#### addresses Table
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

#### orders Table
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

#### order_items Table
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

### 5. Order History

**Location**: [`OrderHistoryComponent`](src/app/pages/order-history/order-history.component.ts)

**Features**:
- Display all user orders sorted by date (newest first)
- Expandable order details showing all items
- Order status badges (pending, processing, shipped, delivered, cancelled)
- Payment status badges
- "Buy Again" functionality for individual items
- "Buy All Items Again" for entire orders
- Order cancellation (for non-delivered orders)

**API Call**:
```typescript
this.orderService.getUserOrders().subscribe({
  next: (response) => {
    this.orders.set(response.data);
  }
});
```

### 6. Buy Again Feature

**Individual Item**:
```typescript
buyItemAgain(item: OrderItem) {
  // Adds the item back to cart with original quantity
  this.bookService.addToCart(item.book!);
  this.bookService.updateQuantity(item.book!.id, item.quantity);
}
```

**Entire Order**:
```typescript
buyOrderAgain(order: Order) {
  // Adds all items from the order back to cart
  order.items?.forEach(item => {
    this.bookService.addToCart(item.book!);
    this.bookService.updateQuantity(item.book!.id, item.quantity);
  });
}
```

## Testing the Flow

### Step 1: Add Items to Cart
1. Browse books on the home page
2. Click "Add to Cart" on any book
3. Verify cart icon shows item count

### Step 2: View Cart
1. Click cart icon in header
2. Verify items are displayed
3. Adjust quantities if needed
4. Apply coupon code (optional)
5. Click "Proceed to Checkout"

### Step 3: Complete Payment
1. Fill in shipping address:
   - Full Name: "John Doe"
   - Phone: "9876543210"
   - Address Line 1: "123 Main Street"
   - City: "Mumbai"
   - State: "Maharashtra"
   - Postal Code: "400001"
2. Select payment method (e.g., Credit Card)
3. Click "Pay Now"
4. Wait for processing (shows spinner)

### Step 4: Verify Order Creation
1. Check browser console for success message
2. Verify navigation to payment success page
3. Cart should be empty

### Step 5: View Order History
1. Click "My Orders" in header
2. Verify new order appears at the top
3. Click to expand order details
4. Verify all items are listed correctly
5. Check order status and payment status

### Step 6: Test Buy Again
1. Click "Buy Again" on any item
2. Verify item is added to cart
3. Or click "Buy All Items Again"
4. Verify all items are added to cart

## Troubleshooting

### Orders Not Appearing in History

**Problem**: After checkout, orders don't show in "My Orders"

**Solution**: 
- Check browser console for API errors
- Verify backend is running (`npm run dev` in backend folder)
- Check database connection
- Verify JWT token is valid (try logging out and back in)

### Address Creation Fails

**Problem**: Error when creating shipping address

**Solution**:
- Ensure all required fields are filled
- Check backend logs for validation errors
- Verify addresses table exists in database
- Check user authentication token

### Cart Not Clearing After Order

**Problem**: Cart items remain after successful order

**Solution**:
- Check if `clearCart()` is called after order creation
- Verify localStorage is accessible
- Check browser console for errors

## API Authentication

All order and address endpoints require JWT authentication:

```typescript
// Auth interceptor automatically adds token
headers: {
  'Authorization': 'Bearer <jwt-token>'
}
```

Token is obtained during login and stored in localStorage with key `bookworm_token`.

## Related Documentation

- [Buy Again Feature Guide](BUY-AGAIN-FEATURE.md)
- [Wishlist Feature Guide](WISHLIST-FEATURE-GUIDE.md)
- [Coupon Implementation](COUPON-IMPLEMENTATION.md)
- [Architecture Overview](ARCHITECTURE.md)

## Made with Bob