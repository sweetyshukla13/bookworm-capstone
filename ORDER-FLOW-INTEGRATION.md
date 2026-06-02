# Order Creation Flow - Complete Integration Guide

## Database Tables Involved

When an order is placed, data is saved to **2 main tables**:

### 1. `orders` Table
Stores the main order information:
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,              -- Who placed the order
  order_number VARCHAR UNIQUE,        -- e.g., "ORD-1234567890-ABC123"
  status VARCHAR,                     -- 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  total_amount DECIMAL(10,2),         -- Total order amount
  shipping_address_id UUID,           -- Reference to addresses table
  payment_method VARCHAR,             -- 'Credit Card', 'Debit Card', 'UPI', etc.
  payment_status VARCHAR,             -- 'pending', 'completed', 'failed', 'refunded'
  notes TEXT,                         -- Optional order notes
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### 2. `order_items` Table
Stores individual items in each order:
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID NOT NULL,             -- Reference to orders table
  book_id UUID NOT NULL,              -- Reference to books table
  quantity INTEGER,                   -- Number of books ordered
  price DECIMAL(10,2),                -- Price per book at time of order
  subtotal DECIMAL(10,2),             -- quantity × price
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Complete Order Flow

```
User adds books to cart
         ↓
User goes to payment page
         ↓
User enters payment details
         ↓
User clicks "Process Payment"
         ↓
Payment component calls OrderService.createOrder()
         ↓
API creates order in database:
  1. INSERT into orders table
  2. INSERT into order_items table (for each cart item)
         ↓
Order created successfully
         ↓
Navigate to payment success page
         ↓
User can view order in "My Orders"
```

## Implementation Code

### Step 1: Update Payment Component

Add order creation to [`payment.component.ts`](book-worm/src/app/pages/payment/payment.component.ts:1):

```typescript
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Coupon } from '../../models/coupon.model';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  private bookService = inject(BookService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private router = inject(Router);

  orderSummary = computed(() => this.bookService.calculateOrderSummary());
  selectedPaymentMethod = signal<'credit' | 'debit' | 'upi' | 'wallet'>('credit');
  appliedCoupon = this.bookService.coupon;
  
  cardNumber = '';
  cardName = '';
  cvv = '';
  expiryDate = '';
  
  // Shipping address (you'll need to add address selection UI)
  shippingAddressId = signal<string>(''); // This should come from user's saved addresses
  
  // Coupon related properties
  couponCode = signal('');
  couponMessage = signal('');
  isApplyingCoupon = signal(false);
  couponError = signal(false);
  
  // Processing state
  isProcessing = signal(false);

  selectPaymentMethod(method: 'credit' | 'debit' | 'upi' | 'wallet'): void {
    this.selectedPaymentMethod.set(method);
  }

  applyCoupon(): void {
    const code = this.couponCode().trim();
    
    if (!code) {
      this.couponMessage.set('Please enter a coupon code');
      this.couponError.set(true);
      return;
    }

    this.isApplyingCoupon.set(true);
    this.couponMessage.set('');
    this.couponError.set(false);

    this.bookService.validateCoupon(code).subscribe({
      next: (response) => {
        this.isApplyingCoupon.set(false);
        if (response.success) {
          this.couponMessage.set(response.message || 'Coupon applied successfully!');
          this.couponError.set(false);
          this.couponCode.set('');
        } else {
          this.couponMessage.set(response.message || 'Invalid coupon code');
          this.couponError.set(true);
        }
      },
      error: (error) => {
        this.isApplyingCoupon.set(false);
        this.couponMessage.set('Failed to apply coupon. Please try again.');
        this.couponError.set(true);
      }
    });
  }

  removeCoupon(): void {
    this.bookService.removeCoupon();
    this.couponMessage.set('Coupon removed');
    this.couponError.set(false);
    setTimeout(() => this.couponMessage.set(''), 3000);
  }

  processPayment(): void {
    // Validate payment details
    if (!this.validatePaymentDetails()) {
      alert('Please fill in all payment details');
      return;
    }

    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      alert('Please login to complete your order');
      this.router.navigate(['/login']);
      return;
    }

    this.isProcessing.set(true);

    // Simulate payment processing (in real app, call payment gateway)
    setTimeout(() => {
      this.createOrder();
    }, 1000);
  }

  private validatePaymentDetails(): boolean {
    const method = this.selectedPaymentMethod();
    
    if (method === 'credit' || method === 'debit') {
      return !!(this.cardNumber && this.cardName && this.cvv && this.expiryDate);
    }
    
    return true; // For UPI and wallet, assume validation is done
  }

  private createOrder(): void {
    const cart = this.bookService.cart();
    const summary = this.orderSummary();
    
    // Prepare order data
    const orderData = {
      items: cart.map(item => ({
        bookId: item.id,
        quantity: item.quantity || 1,
        price: item.price
      })),
      shippingAddressId: this.shippingAddressId() || this.getDefaultAddressId(),
      paymentMethod: this.getPaymentMethodName(),
      totalAmount: summary.finalTotal,
      notes: this.appliedCoupon() ? `Coupon applied: ${this.appliedCoupon()?.code}` : undefined
    };

    // Create order via API
    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        console.log('Order created successfully:', response.data);
        this.isProcessing.set(false);
        
        // Navigate to success page with order ID
        this.router.navigate(['/payment-success'], {
          queryParams: { orderId: response.data.id }
        });
      },
      error: (error) => {
        console.error('Order creation failed:', error);
        this.isProcessing.set(false);
        alert('Failed to create order. Please try again.');
      }
    });
  }

  private getPaymentMethodName(): string {
    const methods = {
      credit: 'Credit Card',
      debit: 'Debit Card',
      upi: 'UPI',
      wallet: 'Wallet'
    };
    return methods[this.selectedPaymentMethod()];
  }

  private getDefaultAddressId(): string {
    // TODO: Implement address selection
    // For now, return a placeholder
    // In production, you should:
    // 1. Fetch user's addresses
    // 2. Let user select shipping address
    // 3. Or create new address if none exists
    return 'default-address-id';
  }
}
```

### Step 2: Update Payment Success Component

Update [`payment-success.component.ts`](book-worm/src/app/pages/payment-success/payment-success.component.ts:1) to show order details:

```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  private bookService = inject(BookService);
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  
  order = signal<Order | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    // Get order ID from query params
    const orderId = this.route.snapshot.queryParams['orderId'];
    
    if (orderId) {
      // Fetch order details
      this.orderService.getOrderById(orderId).subscribe({
        next: (response) => {
          this.order.set(response.data);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Failed to fetch order:', error);
          this.loading.set(false);
        }
      });
    } else {
      this.loading.set(false);
    }

    // Clear cart after successful payment
    setTimeout(() => {
      this.bookService.clearCart();
    }, 3000);
  }

  formatCurrency(amount: number): string {
    return `₹${amount.toFixed(2)}`;
  }
}
```

## Data Flow Example

### When User Places Order:

**Cart Contents:**
```javascript
[
  { id: 'book-uuid-1', title: 'Book 1', price: 299.00, quantity: 2 },
  { id: 'book-uuid-2', title: 'Book 2', price: 399.00, quantity: 1 }
]
```

**Order Created in Database:**

**orders table:**
```sql
INSERT INTO orders VALUES (
  'order-uuid-123',                    -- id
  'user-uuid-456',                     -- user_id
  'ORD-1733068800-XYZ789',            -- order_number
  'processing',                        -- status
  997.00,                              -- total_amount (299*2 + 399)
  'address-uuid-789',                  -- shipping_address_id
  'Credit Card',                       -- payment_method
  'completed',                         -- payment_status
  NULL,                                -- notes
  NOW(),                               -- created_at
  NOW()                                -- updated_at
);
```

**order_items table:**
```sql
-- Item 1
INSERT INTO order_items VALUES (
  'item-uuid-1',                       -- id
  'order-uuid-123',                    -- order_id
  'book-uuid-1',                       -- book_id
  2,                                   -- quantity
  299.00,                              -- price
  598.00,                              -- subtotal (299 * 2)
  NOW(),                               -- created_at
  NOW()                                -- updated_at
);

-- Item 2
INSERT INTO order_items VALUES (
  'item-uuid-2',                       -- id
  'order-uuid-123',                    -- order_id
  'book-uuid-2',                       -- book_id
  1,                                   -- quantity
  399.00,                              -- price
  399.00,                              -- subtotal (399 * 1)
  NOW(),                               -- created_at
  NOW()                                -- updated_at
);
```

## How Order Appears in Order History

After order creation, when user visits `/orders`:

1. **API Call:** `GET /api/v1/orders`
2. **Database Query:** Fetches orders with JOIN to order_items and books
3. **Response:**
```json
{
  "status": "success",
  "message": "Orders retrieved successfully",
  "data": [
    {
      "id": "order-uuid-123",
      "orderNumber": "ORD-1733068800-XYZ789",
      "status": "processing",
      "totalAmount": "997.00",
      "paymentStatus": "completed",
      "paymentMethod": "Credit Card",
      "createdAt": "2024-12-01T10:00:00.000Z",
      "items": [
        {
          "id": "item-uuid-1",
          "quantity": 2,
          "price": "299.00",
          "subtotal": "598.00",
          "book": {
            "id": "book-uuid-1",
            "title": "Book 1",
            "author": "Author 1",
            "coverImage": "https://..."
          }
        },
        {
          "id": "item-uuid-2",
          "quantity": 1,
          "price": "399.00",
          "subtotal": "399.00",
          "book": {
            "id": "book-uuid-2",
            "title": "Book 2",
            "author": "Author 2",
            "coverImage": "https://..."
          }
        }
      ],
      "shippingAddress": {
        "fullName": "John Doe",
        "addressLine1": "123 Main St",
        "city": "New York",
        "state": "NY",
        "postalCode": "10001",
        "country": "USA"
      }
    }
  ]
}
```

4. **Frontend Display:** Order history component renders this data

## Quick Test Without Address

For testing without implementing address management, you can:

1. **Create a test address directly in database:**
```sql
INSERT INTO addresses (id, user_id, full_name, address_line1, city, state, postal_code, country)
VALUES (
  gen_random_uuid(),
  'YOUR_USER_ID',
  'Test User',
  '123 Test Street',
  'Test City',
  'Test State',
  '12345',
  'India'
);
```

2. **Use this address ID in payment component**

## Summary

✅ **2 Tables Updated:** `orders` and `order_items`
✅ **Order Flow:** Cart → Payment → Create Order → Order History
✅ **Data Relationships:** Order → Order Items → Books
✅ **Automatic Display:** Orders appear in `/orders` immediately after creation

---

**Made with Bob**