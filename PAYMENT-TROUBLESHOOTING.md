# Payment & Order Creation Troubleshooting Guide

## Issue: "Pay Now" Button Not Working

### Quick Fixes

#### 1. Refresh the Browser
The Angular app might not have reloaded the changes:
1. Go to `http://localhost:4200`
2. Press `Ctrl + Shift + R` (hard refresh) or `Ctrl + F5`
3. Clear browser cache if needed

#### 2. Check Browser Console
1. Press `F12` to open Developer Tools
2. Go to **Console** tab
3. Look for any red error messages
4. Common errors:
   - `Cannot find module` - TypeScript compilation error
   - `undefined is not a function` - Missing import or service
   - `HTTP error` - Backend API issue

#### 3. Verify Angular Dev Server
Check if the Angular app is running:
```bash
# Should see: "Angular Live Development Server is listening on localhost:4200"
# If not running, start it:
cd book-worm
npm start
```

#### 4. Check Backend Server
Verify backend is running:
```bash
# Should see: "Server is running on port 3000"
# If not running, start it:
cd book-worm/backend
npm run dev
```

### Step-by-Step Testing

#### Test 1: Verify Payment Page Loads
1. Add a book to cart
2. Go to cart page
3. Click "Proceed to Checkout"
4. **Expected**: Payment page loads with shipping address form
5. **If fails**: Check console for routing errors

#### Test 2: Fill Shipping Address
Fill all required fields (marked with *):
- Full Name: `John Doe`
- Phone Number: `9876543210`
- Address Line 1: `123 Main Street`
- City: `Mumbai`
- State: `Maharashtra`
- Postal Code: `400001`
- Country: `India` (pre-filled)

#### Test 3: Click Pay Now
1. Select a payment method (Credit Card, Debit Card, UPI, or Wallet)
2. Click "Pay Now" button
3. **Expected**: 
   - Button shows "Processing..." with spinner
   - After 1-2 seconds, redirects to success page
   - Cart is cleared
4. **If button does nothing**:
   - Check browser console for errors
   - Verify all required fields are filled
   - Try hard refresh (Ctrl + Shift + R)

#### Test 4: Verify Order in Database
After successful payment:
1. Go to "My Orders" page
2. **Expected**: New order appears at the top
3. **If empty**: Check backend terminal for API errors

### Common Errors & Solutions

#### Error: "Please fill in all shipping address fields"
**Cause**: Required fields are empty  
**Solution**: Fill all fields marked with * (asterisk)

#### Error: "Your cart is empty"
**Cause**: No items in cart  
**Solution**: Add books to cart before checkout

#### Error: "Failed to save shipping address"
**Cause**: Backend address API error  
**Solution**: 
1. Check backend terminal for error logs
2. Verify database connection
3. Check if `addresses` table exists

#### Error: "Failed to create order"
**Cause**: Backend order API error  
**Solution**:
1. Check backend terminal for error logs
2. Verify address was created successfully
3. Check if `orders` and `order_items` tables exist

#### Button Does Nothing (No Error)
**Possible Causes**:
1. Angular app not reloaded
2. TypeScript compilation error
3. Event handler not bound

**Solutions**:
1. Hard refresh browser (Ctrl + Shift + R)
2. Check browser console for compilation errors
3. Restart Angular dev server:
   ```bash
   # Stop current server (Ctrl + C)
   cd book-worm
   npm start
   ```

### Verify Backend API Manually

#### Test Address Creation
```bash
# Using curl or Postman
POST http://localhost:3000/api/v1/addresses
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN
  Content-Type: application/json
Body:
{
  "fullName": "John Doe",
  "addressLine1": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postalCode": "400001",
  "country": "India",
  "phoneNumber": "9876543210"
}
```

**Expected Response**:
```json
{
  "status": "success",
  "message": "Address created successfully",
  "data": {
    "id": "uuid-here",
    ...
  }
}
```

#### Test Order Creation
```bash
POST http://localhost:3000/api/v1/orders
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN
  Content-Type: application/json
Body:
{
  "items": [
    {
      "bookId": "book-uuid",
      "quantity": 1,
      "price": 499.00
    }
  ],
  "shippingAddressId": "address-uuid-from-above",
  "paymentMethod": "credit",
  "totalAmount": 499.00
}
```

**Expected Response**:
```json
{
  "status": "success",
  "message": "Order created successfully",
  "data": {
    "id": "order-uuid",
    "orderNumber": "ORD-1234567890-ABC",
    ...
  }
}
```

### Check Database Tables

#### Verify Tables Exist
```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('addresses', 'orders', 'order_items');
```

#### Check Order Data
```sql
-- View all orders
SELECT * FROM orders ORDER BY created_at DESC;

-- View order items
SELECT * FROM order_items WHERE order_id = 'your-order-id';

-- View addresses
SELECT * FROM addresses ORDER BY created_at DESC;
```

### Debug Mode

#### Enable Console Logging
The payment component already has console.log statements:
1. Open browser console (F12)
2. Click "Pay Now"
3. Look for these messages:
   - `Order created successfully:` - Order creation succeeded
   - `Error creating order:` - Order creation failed
   - `Error creating address:` - Address creation failed

#### Check Network Tab
1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Click "Pay Now"
4. Look for API calls:
   - `POST /api/v1/addresses` - Should return 201
   - `POST /api/v1/orders` - Should return 201
5. Click on each request to see:
   - Request payload
   - Response data
   - Status code

### Still Not Working?

If none of the above solutions work:

1. **Check JWT Token**:
   - Open browser console
   - Type: `localStorage.getItem('bookworm_token')`
   - Should return a long string
   - If null, log out and log back in

2. **Verify User Authentication**:
   - Backend logs should show: `SELECT ... FROM users WHERE id = 'user-uuid'`
   - If not, authentication is failing

3. **Check File Changes**:
   - Verify [`payment.component.ts`](src/app/pages/payment/payment.component.ts) has the `processPayment()` method
   - Verify [`payment.component.html`](src/app/pages/payment/payment.component.html) has shipping address form
   - Verify [`app.js`](backend/src/app.js) has address routes registered

4. **Restart Everything**:
   ```bash
   # Stop both servers (Ctrl + C in each terminal)
   
   # Start backend
   cd book-worm/backend
   npm run dev
   
   # Start frontend (in new terminal)
   cd book-worm
   npm start
   ```

5. **Clear Browser Data**:
   - Clear cache and cookies
   - Close and reopen browser
   - Try incognito/private mode

## Contact Support

If the issue persists, provide:
1. Browser console errors (screenshot)
2. Backend terminal logs
3. Network tab screenshot showing failed requests
4. Steps you followed

## Made with Bob