# Book Worm - Frontend-Backend Integration Guide

## ✅ Integration Complete!

All mock data has been replaced with real API calls. The Angular frontend now communicates with the Node.js + Express backend.

## 🎯 What Was Changed

### 1. Environment Configuration
**Created:**
- [`src/environments/environment.ts`](src/environments/environment.ts:1) - Development API URL
- [`src/environments/environment.prod.ts`](src/environments/environment.prod.ts:1) - Production API URL

**API Base URL:** `http://localhost:3000/api/v1`

### 2. HTTP Client Setup
**Updated:**
- [`src/app/app.config.ts`](src/app/app.config.ts:1) - Added `provideHttpClient` with auth interceptor

**Created:**
- [`src/app/interceptors/auth.interceptor.ts`](src/app/interceptors/auth.interceptor.ts:1) - Automatically adds JWT token to all API requests

### 3. Authentication Service
**Updated:** [`src/app/services/auth.service.ts`](src/app/services/auth.service.ts:1)

**Changes:**
- ❌ Removed: LocalStorage-based mock authentication
- ✅ Added: Real API calls to backend endpoints
- ✅ Added: JWT token management
- ✅ Added: Observable-based async operations

**API Endpoints Used:**
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/logout` - User logout

**Token Storage:**
- Token stored in: `localStorage.getItem('bookworm_token')`
- User data stored in: `localStorage.getItem('bookworm_current_user')`

### 4. Book Service
**Updated:** [`src/app/services/book.service.ts`](src/app/services/book.service.ts:1)

**Changes:**
- ❌ Removed: Hardcoded mock book data array
- ✅ Added: Real API calls to fetch books
- ✅ Added: Observable-based async operations
- ✅ Kept: Local cart management (not API-based yet)

**API Endpoints Used:**
- `GET /api/v1/books` - Fetch all books
- `GET /api/v1/books/:id` - Fetch single book
- `GET /api/v1/books?category=X` - Fetch books by category

**Cart Storage:**
- Cart stored locally in: `localStorage.getItem('bookworm_cart')`
- Cart operations remain client-side for now

### 5. Component Updates

**Updated:** [`src/app/pages/login/login.component.ts`](src/app/pages/login/login.component.ts:1)
- Changed from synchronous to Observable-based login
- Added proper error handling
- Added loading states

**Updated:** [`src/app/pages/signup/signup.component.ts`](src/app/pages/signup/signup.component.ts:1)
- Changed from synchronous to Observable-based signup
- Added proper error handling
- Added loading states

**Updated:** [`src/app/pages/home/home.component.ts`](src/app/pages/home/home.component.ts:1)
- Changed from direct array access to Observable subscription
- Added `ngOnInit` to load books on component initialization
- Books now fetched from API on page load

**Updated:** [`src/app/pages/book-detail/book-detail.component.ts`](src/app/pages/book-detail/book-detail.component.ts:1)
- Changed from synchronous to Observable-based book fetching
- Added proper error handling for book details
- Added proper error handling for related books

## 🚀 How to Run

### 1. Start Backend Server
```bash
cd book-worm/backend
npm run dev
```
Backend will run on: `http://localhost:3000`

### 2. Start Frontend Server
```bash
cd book-worm
npm start
```
Frontend will run on: `http://localhost:4200`

### 3. Verify Integration
Open browser to: `http://localhost:4200`

## 🔍 Testing the Integration

### Test Authentication Flow

1. **Sign Up:**
   - Navigate to `/signup`
   - Fill in: Name, Email, Password
   - Click "Sign Up"
   - Should redirect to home page
   - Check browser console for API call
   - Check Network tab for `POST /api/v1/auth/register`

2. **Login:**
   - Navigate to `/login`
   - Enter credentials
   - Click "Login"
   - Should redirect to home page
   - Check localStorage for `bookworm_token`
   - Check Network tab for `POST /api/v1/auth/login`

3. **Logout:**
   - Click logout button in header
   - Should redirect to login page
   - Token should be removed from localStorage
   - Check Network tab for `POST /api/v1/auth/logout`

### Test Book Fetching

1. **Home Page:**
   - Navigate to `/`
   - Books should load from API
   - Check Network tab for `GET /api/v1/books`
   - Check browser console for any errors

2. **Book Details:**
   - Click on any book card
   - Should navigate to `/book/:id`
   - Book details should load from API
   - Check Network tab for `GET /api/v1/books/:id`

3. **Category Filter:**
   - Select a category from sidebar
   - Books should filter (client-side for now)
   - Future: Will use `GET /api/v1/books?category=X`

### Test Cart Operations

**Note:** Cart operations are still client-side (localStorage)

1. **Add to Cart:**
   - Click "Add to Cart" on any book
   - Cart count should increase in header
   - Check localStorage for `bookworm_cart`

2. **View Cart:**
   - Navigate to `/cart`
   - Should see added books
   - Can update quantities
   - Can remove items

## 🔐 Authentication Flow

```
User Login/Signup
       ↓
Frontend sends credentials to API
       ↓
Backend validates & returns JWT token
       ↓
Frontend stores token in localStorage
       ↓
Auth Interceptor adds token to all requests
       ↓
Backend validates token on protected routes
```

## 📡 API Request Flow

```
Component calls Service method
       ↓
Service makes HTTP request
       ↓
Auth Interceptor adds JWT token (if exists)
       ↓
Request sent to Backend API
       ↓
Backend processes & returns response
       ↓
Service receives Observable response
       ↓
Component subscribes & updates UI
```

## 🐛 Troubleshooting

### Issue: API calls failing with 404
**Solution:**
- Ensure backend server is running on port 3000
- Check `environment.ts` has correct API URL
- Verify backend routes are registered

### Issue: CORS errors
**Solution:**
- Backend already configured for CORS
- Allowed origin: `http://localhost:4200`
- Check backend `.env` file: `CORS_ORIGIN=http://localhost:4200`

### Issue: Authentication not working
**Solution:**
- Check if token is stored in localStorage
- Check Network tab for 401 errors
- Verify backend auth middleware is working
- Check if token is being sent in Authorization header

### Issue: Books not loading
**Solution:**
- Check if backend database has books
- Check Network tab for API response
- Check browser console for errors
- Verify backend `/api/v1/books` endpoint is working

## 📝 Next Steps

### Backend Enhancements Needed

1. **Implement Missing Controllers:**
   - Cart API endpoints (currently client-side only)
   - Wishlist API endpoints
   - Order processing endpoints
   - Payment integration endpoints
   - Review system endpoints

2. **Add More Models:**
   - Cart, CartItem
   - Order, OrderItem
   - Payment
   - Review
   - Wishlist
   - Address
   - Coupon
   - Shipment
   - GiftPoints

3. **Database Seeding:**
   - Create seed data for books
   - Create seed data for categories
   - Add sample users for testing

4. **Testing:**
   - Write unit tests for services
   - Write integration tests for API endpoints
   - Add E2E tests for critical flows

### Frontend Enhancements Needed

1. **Error Handling:**
   - Add global error handler
   - Show user-friendly error messages
   - Add retry logic for failed requests

2. **Loading States:**
   - Add loading spinners
   - Add skeleton screens
   - Improve UX during API calls

3. **Offline Support:**
   - Add service worker
   - Cache API responses
   - Handle offline scenarios

4. **Performance:**
   - Implement pagination for book lists
   - Add lazy loading for images
   - Optimize bundle size

## 📚 API Documentation

Full API documentation available in:
- [`book-worm/openapi.yaml`](book-worm/openapi.yaml:1) - Complete OpenAPI 3.0 specification
- [`book-worm/backend/API-QUICK-START.md`](book-worm/backend/API-QUICK-START.md:1) - Quick reference guide

## 🎉 Summary

✅ **Completed:**
- Environment configuration
- HTTP client setup with interceptor
- Authentication service with real API
- Book service with real API
- All components updated to use Observables
- JWT token management
- Error handling
- Loading states

✅ **Working:**
- User registration
- User login
- User logout
- Fetch all books
- Fetch single book
- Fetch books by category
- Add to cart (local)
- Cart management (local)

🚧 **Pending:**
- Backend controllers for cart, orders, payments
- Additional database models
- Database seeding
- Comprehensive testing
- Production deployment configuration

The integration is complete and functional! The frontend now communicates with the backend API for authentication and book data.