# Coupon System Implementation Guide

## Overview
This document describes the complete coupon validation system implementation for the Book Worm E-Bookstore, including both backend API and frontend integration.

## Backend Implementation

### 1. Database Schema

The `coupons` table includes the following fields:

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| code | VARCHAR(50) | Unique coupon code (uppercase) |
| description | VARCHAR(255) | Coupon description |
| discount_type | ENUM | 'percentage' or 'fixed' |
| discount_value | DECIMAL(10,2) | Discount amount or percentage |
| min_order_amount | DECIMAL(10,2) | Minimum order amount required |
| max_discount_amount | DECIMAL(10,2) | Maximum discount cap (for percentage) |
| expiry_date | DATE | Coupon expiration date |
| is_active | BOOLEAN | Whether coupon is active |
| usage_limit | INTEGER | Maximum number of uses allowed |
| usage_count | INTEGER | Current usage count |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### 2. API Endpoints

#### Validate Coupon
**POST** `/api/v1/coupons/validate`

Validates a coupon code and calculates the discount amount.

**Request Body:**
```json
{
  "code": "WELCOME10",
  "orderAmount": 500
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Coupon applied successfully",
  "coupon": {
    "id": "uuid",
    "code": "WELCOME10",
    "description": "Welcome offer - Get 10% off",
    "discountType": "percentage",
    "discountValue": 10,
    "minOrderAmount": 299,
    "maxDiscountAmount": 100,
    "expiryDate": "2026-12-31",
    "isActive": true
  },
  "discountAmount": 50
}
```

**Error Responses:**
- `400` - Invalid coupon code, expired, inactive, or minimum order not met
- `404` - Coupon not found
- `500` - Server error

#### Get All Active Coupons
**GET** `/api/v1/coupons`

Returns all active, non-expired coupons.

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "code": "WELCOME10",
      "description": "Welcome offer - Get 10% off",
      "discountType": "percentage",
      "discountValue": 10,
      "minOrderAmount": 299,
      "maxDiscountAmount": 100,
      "expiryDate": "2026-12-31",
      "isActive": true
    }
  ]
}
```

#### Increment Coupon Usage
**POST** `/api/v1/coupons/:id/use`

Increments the usage count after successful order completion.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Coupon usage recorded"
}
```

### 3. Validation Rules

The backend validates:
1. ✅ Coupon code exists
2. ✅ Coupon is active (`is_active = true`)
3. ✅ Coupon has not expired
4. ✅ Usage limit not exceeded
5. ✅ Minimum order amount requirement met
6. ✅ Discount calculation with max cap (for percentage discounts)

## Frontend Integration

### 1. Service Layer

The [`BookService`](book-worm/src/app/services/book.service.ts) handles coupon operations:

```typescript
validateCoupon(couponCode: string): Observable<CouponValidationResponse> {
  return this.http.post<CouponValidationResponse>(
    `${this.apiUrl}/coupons/validate`,
    { code: couponCode, orderAmount: this.calculateOrderSummary().subtotal }
  ).pipe(
    tap(response => {
      if (response.success && response.coupon) {
        this.appliedCoupon.set(response.coupon);
      }
    })
  );
}
```

### 2. Order Summary Calculation

The discount is automatically applied in the order summary:

```typescript
calculateOrderSummary(): OrderSummary {
  const subtotal = this.cartItems().reduce(
    (sum, item) => sum + item.book.price * item.quantity, 0
  );
  
  let discount = 0;
  const appliedCoupon = this.appliedCoupon();
  
  if (appliedCoupon && appliedCoupon.isActive) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscountAmount) {
        discount = Math.min(discount, appliedCoupon.maxDiscountAmount);
      }
    } else if (appliedCoupon.discountType === 'fixed') {
      discount = appliedCoupon.discountValue;
    }
  }
  
  const total = subtotal + tax + deliveryCharges - discount;
  return { subtotal, tax, deliveryCharges, discount, total };
}
```

### 3. UI Integration

In your payment or cart component:

```typescript
applyCoupon() {
  if (!this.couponCode.trim()) return;
  
  this.bookService.validateCoupon(this.couponCode).subscribe({
    next: (response) => {
      if (response.success) {
        this.showSuccess(response.message);
        // Order summary will automatically update
      } else {
        this.showError(response.message);
      }
    },
    error: (error) => {
      this.showError('Failed to apply coupon');
    }
  });
}

removeCoupon() {
  this.bookService.removeCoupon();
  this.couponCode = '';
}
```

## Setup Instructions

### Backend Setup

1. **Install Dependencies:**
```bash
cd book-worm/backend
npm install
```

2. **Configure Environment:**
Create a `.env` file based on `.env.example`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookworm
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3000
CORS_ORIGIN=http://localhost:4200
```

3. **Create Database:**
```sql
CREATE DATABASE bookworm;
```

4. **Run Migrations:**
```bash
npm run migrate
```

5. **Seed Sample Coupons:**
```bash
npm run seed
```

6. **Start Server:**
```bash
npm run dev
```

The API will be available at `http://localhost:3000/api/v1`

### Frontend Configuration

Ensure your [`environment.ts`](book-worm/src/environments/environment.ts) points to the backend:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1'
};
```

## Sample Coupons

After seeding, the following coupons are available:

| Code | Type | Discount | Min Order | Max Discount | Description |
|------|------|----------|-----------|--------------|-------------|
| WELCOME10 | Percentage | 10% | ₹299 | ₹100 | Welcome offer |
| SAVE20 | Percentage | 20% | ₹500 | ₹200 | Save 20% |
| FLAT50 | Fixed | ₹50 | ₹200 | - | Flat discount |
| MEGA30 | Percentage | 30% | ₹1000 | ₹500 | Mega sale |
| FLAT100 | Fixed | ₹100 | ₹800 | - | Flat discount |
| BOOKWORM15 | Percentage | 15% | ₹400 | ₹150 | Special offer |

## Testing

### Test Coupon Validation

```bash
curl -X POST http://localhost:3000/api/v1/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{"code": "WELCOME10", "orderAmount": 500}'
```

### Test Get All Coupons

```bash
curl http://localhost:3000/api/v1/coupons
```

## Error Handling

The system handles various error scenarios:

- **Invalid Code**: Returns 404 with "Invalid coupon code"
- **Expired**: Returns 400 with "This coupon has expired"
- **Inactive**: Returns 400 with "This coupon is no longer active"
- **Usage Limit**: Returns 400 with "This coupon has reached its usage limit"
- **Min Order**: Returns 400 with minimum order amount message

## Security Considerations

1. Coupon codes are stored in uppercase for consistency
2. All validations happen server-side
3. Usage tracking prevents abuse
4. Expiry dates are checked on every validation
5. CORS is configured to allow only trusted origins

## Future Enhancements

- [ ] User-specific coupons
- [ ] Category-specific coupons
- [ ] First-time user coupons
- [ ] Referral coupons
- [ ] Bulk coupon generation
- [ ] Admin dashboard for coupon management
- [ ] Analytics and reporting

## Made with Bob 🤖