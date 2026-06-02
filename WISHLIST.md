# Wishlist Feature - Complete Guide

## Overview

The wishlist feature allows users to save books they're interested in for later purchase. Users can add/remove books from their wishlist, view all wishlist items, and quickly add them to cart.

---

## Table of Contents

1. [Features](#features)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Frontend Implementation](#frontend-implementation)
5. [How to Use](#how-to-use)
6. [Testing Guide](#testing-guide)
7. [Troubleshooting](#troubleshooting)

---

## Features

### ✅ Implemented Features

1. **Heart Icon Toggle** - Click to add/remove from wishlist
2. **Visual Feedback** - Red heart = in wishlist, Gray heart = not in wishlist
3. **Wishlist Page** - Dedicated page showing all wishlist items
4. **Add to Cart** - Add wishlist items directly to cart
5. **Remove Items** - Remove individual items from wishlist
6. **Clear Wishlist** - Remove all items at once
7. **Wishlist Summary** - See total value and savings
8. **Stock Status** - Shows if items are in stock
9. **View Details** - Navigate to book detail page
10. **Persistent Storage** - Wishlist saved in database
11. **Authentication Required** - Must be logged in to use wishlist
12. **Duplicate Prevention** - Each book can only be added once per user
13. **Reactive State Management** - Uses Angular signals for real-time updates

### 🔄 Potential Enhancements

1. **Wishlist Sharing** - Share wishlist with friends
2. **Price Alerts** - Notify when wishlist items go on sale
3. **Move to Cart** - Move item from wishlist to cart (removes from wishlist)
4. **Wishlist Collections** - Organize wishlist into categories
5. **Priority Levels** - Mark items as high/medium/low priority
6. **Notes** - Add personal notes to wishlist items
7. **Wishlist Analytics** - Track most wishlisted books

---

## Database Schema

### `wishlists` Table

```sql
CREATE TABLE wishlists (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,           -- Reference to users table
  book_id UUID NOT NULL,           -- Reference to books table
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(user_id, book_id)        -- Prevent duplicate entries
);
```

### Database Relationships

```
User (1) ----< (N) Wishlist (N) >---- (1) Book

One user can have many wishlist items
One book can be in many users' wishlists
Each wishlist entry is unique per user-book combination
```

---

## API Endpoints

### Get User's Wishlist

```http
GET /api/v1/wishlist
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "message": "Wishlist retrieved successfully",
  "data": [
    {
      "id": "wishlist-item-uuid",
      "userId": "user-uuid",
      "bookId": "book-uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "book": {
        "id": "book-uuid",
        "title": "Book Title",
        "author": "Author Name",
        "price": 299.00,
        "originalPrice": 399.00,
        "coverImage": "https://...",
        "rating": 4.5,
        "inStock": true
      }
    }
  ]
}
```

### Add to Wishlist

```http
POST /api/v1/wishlist
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookId": "book-uuid"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Book added to wishlist",
  "data": {
    "id": "wishlist-item-uuid",
    "userId": "user-uuid",
    "bookId": "book-uuid",
    "book": { ... }
  }
}
```

### Remove from Wishlist

```http
DELETE /api/v1/wishlist/:bookId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "message": "Book removed from wishlist"
}
```

### Check Wishlist Status

```http
GET /api/v1/wishlist/check/:bookId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "inWishlist": true
  }
}
```

### Clear Wishlist

```http
DELETE /api/v1/wishlist
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "message": "Wishlist cleared successfully"
}
```

---

## Frontend Implementation

### Backend Components

#### 1. Wishlist Controller
**File:** `backend/src/controllers/wishlistController.js`

**Methods:**
- `getUserWishlist()` - Get all wishlist items for user
- `addToWishlist()` - Add book to wishlist
- `removeFromWishlist()` - Remove book from wishlist
- `checkWishlistStatus()` - Check if book is in wishlist
- `clearWishlist()` - Clear entire wishlist

#### 2. Wishlist Routes
**File:** `backend/src/routes/wishlist.js`

**Endpoints:**
- `GET /api/v1/wishlist` - Get user's wishlist
- `POST /api/v1/wishlist` - Add book to wishlist
- `GET /api/v1/wishlist/check/:bookId` - Check wishlist status
- `DELETE /api/v1/wishlist/:bookId` - Remove from wishlist
- `DELETE /api/v1/wishlist` - Clear wishlist

**Authentication:** All routes require JWT authentication via `authenticateToken` middleware

### Frontend Components

#### 1. Wishlist Model
**File:** `src/app/models/wishlist.model.ts`

**Interfaces:**
- `WishlistItem` - Individual wishlist item
- `WishlistResponse` - API response format
- `WishlistStatusResponse` - Status check response

#### 2. Wishlist Service
**File:** `src/app/services/wishlist.service.ts`

**Key Methods:**
```typescript
// Load wishlist from API
loadWishlist(): void

// Fetch user wishlist
getUserWishlist(): Observable<WishlistResponse>

// Add book to wishlist
addToWishlist(bookId: string): Observable<WishlistResponse>

// Remove book from wishlist
removeFromWishlist(bookId: string): Observable<any>

// Toggle wishlist status
toggleWishlist(bookId: string): Observable<any>

// Check if book is in wishlist
isInWishlist(bookId: string): boolean

// Clear entire wishlist
clearWishlist(): Observable<any>

// Get wishlist count
getWishlistCount(): number
```

**Reactive State Management:**
```typescript
// Access wishlist items (signal)
const items = this.wishlistService.wishlistItems();

// Access wishlist count (signal)
const count = this.wishlistService.wishlistCount();

// These automatically update when wishlist changes
```

#### 3. Wishlist Button in Book Cards
**File:** `src/app/components/book-card/book-card.component.ts`

**Features:**
- Heart icon button on each book card
- Red when in wishlist, gray when not
- Click to toggle wishlist status
- Requires authentication

#### 4. Wishlist Page
**File:** `src/app/pages/wishlist/wishlist.component.ts`

**Features:**
- Display all wishlist items
- Add to cart functionality
- Remove from wishlist
- View book details
- Clear entire wishlist
- Wishlist summary with total value and savings

#### 5. Navigation
- "My Wishlist" link in header navigation
- Route: `/wishlist`

---

## How to Use

### For Users

#### Adding to Wishlist

**From Book Card:**
1. Click the heart icon in the top-right corner of any book card
2. Icon turns red when added to wishlist
3. Click again to remove from wishlist

**From Book Detail Page:**
- (Can be implemented similarly)

#### Viewing Wishlist

1. Click "My Wishlist" in the header navigation
2. See all your saved books
3. View total value and potential savings

#### Managing Wishlist

- **Add to Cart:** Click "Add to Cart" button on any item
- **Add All to Cart:** Click "Add All to Cart" to add all items at once
- **Remove Item:** Click "Remove" button on specific item
- **Clear Wishlist:** Click "Clear Wishlist" to remove all items
- **View Details:** Click "View Details" or book image/title

### For Developers

#### Using Wishlist Service

```typescript
import { WishlistService } from './services/wishlist.service';

export class MyComponent {
  private wishlistService = inject(WishlistService);

  // Check if book is in wishlist
  isInWishlist(bookId: string): boolean {
    return this.wishlistService.isInWishlist(bookId);
  }

  // Add to wishlist
  addToWishlist(bookId: string): void {
    this.wishlistService.addToWishlist(bookId).subscribe({
      next: () => console.log('Added to wishlist'),
      error: (error) => console.error('Error:', error)
    });
  }

  // Toggle wishlist
  toggleWishlist(bookId: string): void {
    this.wishlistService.toggleWishlist(bookId).subscribe({
      next: () => console.log('Wishlist updated'),
      error: (error) => console.error('Error:', error)
    });
  }

  // Get wishlist count
  getCount(): number {
    return this.wishlistService.getWishlistCount();
  }
}
```

---

## Testing Guide

### Step 1: Clear Browser Cache

1. Open your browser's Developer Tools (F12)
2. Go to Application/Storage tab
3. Clear all site data and cookies
4. Refresh the page (Ctrl+R or Cmd+R)

### Step 2: Login to Your Account

1. Make sure you're logged in to the application
2. You should see your name in the header

### Step 3: Add Books to Wishlist

1. Go to the home page
2. Find a book you like
3. Click the **heart icon (❤️)** on the book card
4. The heart should turn **RED** indicating it's added to wishlist
5. Add 2-3 more books by clicking their heart icons

### Step 4: View Your Wishlist

1. Click **"My Wishlist"** in the header navigation
2. You should see ONLY the books you just added
3. The page will show:
   - "My Wishlist" heading
   - Number of items in your wishlist
   - Each book with its cover, title, author, and price
   - "Add to Cart" and "Remove" buttons for each book

### Step 5: Remove from Wishlist

1. On the wishlist page, click **"Remove"** on any book
2. The book should disappear from the list
3. The item count should decrease

### Step 6: Add to Cart from Wishlist

1. Click **"Add to Cart"** on any wishlist item
2. You should see a confirmation message
3. The cart count in the header should increase

### Expected Behavior

1. **When you click the heart icon:**
   - If not in wishlist → Adds to wishlist, heart turns red
   - If in wishlist → Removes from wishlist, heart turns gray

2. **When you visit /wishlist:**
   - Shows ONLY books YOU added to YOUR wishlist
   - Shows empty state if no items
   - Shows item count and total value

3. **When you remove an item:**
   - Item disappears from the list
   - Count updates immediately
   - Heart icon on home page turns gray

4. **When you add to cart:**
   - Item added to cart
   - Wishlist item remains (not removed)
   - Cart count increases

### Quick Test Checklist

- [ ] Clear browser cache
- [ ] Login to account
- [ ] Add 3 books to wishlist (heart icons turn red)
- [ ] Navigate to "My Wishlist"
- [ ] Verify only those 3 books are shown
- [ ] Remove 1 book from wishlist
- [ ] Verify count decreased to 2
- [ ] Add 1 book to cart from wishlist
- [ ] Verify cart count increased
- [ ] Clear entire wishlist
- [ ] Verify empty state is shown

---

## Troubleshooting

### Wishlist Not Loading

**Problem:** Wishlist page shows loading or empty state

**Solutions:**
- Verify user is authenticated
- Check JWT token is valid
- Ensure wishlist table exists in database
- Check browser console for API errors
- Verify backend server is running

### Cannot Add to Wishlist

**Problem:** Heart icon doesn't change or shows error

**Solutions:**
- Check if book exists in database
- Verify book is not already in wishlist
- Check authentication token
- Ensure backend API is accessible
- Check browser console for errors

### Heart Icon Not Updating

**Problem:** Heart icon doesn't change color after clicking

**Solutions:**
- Ensure WishlistService is properly injected
- Check that signals are being used correctly
- Verify API responses are successful
- Clear browser cache and refresh
- Check Network tab for failed requests

### Seeing Books I Didn't Add

**Problem:** Wishlist shows books from other users or old data

**Solutions:**
- Clear browser cache completely
- Logout and login again
- Check if correct user is logged in
- Verify backend is filtering by user ID
- Check database for duplicate entries

### Wishlist Page Shows "0 items" But I Added Books

**Problem:** Counter shows 0 but books were added

**Solutions:**
- Check if you're logged in with the same account
- Refresh the page
- Check browser console for API errors
- Verify wishlist service is loading data
- Check Network tab for API response

---

## UI/UX Features

### Visual Feedback

1. **Heart Icon States**
   - Gray (outline) - Not in wishlist
   - Red (filled) - In wishlist
   - Hover effects on buttons

2. **Loading States**
   - Spinner while loading wishlist
   - Disabled buttons during operations
   - Loading indicators for API calls

3. **Success/Error Messages**
   - Toast notifications for actions
   - Clear error messages
   - Confirmation dialogs

### Empty State

**When wishlist is empty:**
```
Your wishlist is empty
Start adding books you love to your wishlist!
[Browse Books button]
```

**When wishlist has items:**
```
My Wishlist
3 item(s) in your wishlist

[Book 1 Card]
- Cover image
- Title and Author
- Price
- [Add to Cart] [Remove] [View Details]

[Book 2 Card]
...

Wishlist Summary
- Total Items: 3
- Total Value: ₹1,497.00
- Total Savings: ₹300.00
```

### Responsive Design

- Works on mobile, tablet, and desktop
- Touch-friendly buttons
- Adaptive layouts
- Mobile-optimized navigation

### Accessibility

- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly
- Focus indicators
- High contrast support

---

## Security

- All endpoints require JWT authentication
- Users can only access their own wishlist
- Duplicate entries prevented at database level
- User ID automatically extracted from JWT token
- Input validation on backend
- SQL injection prevention via Sequelize ORM

---

## Technical Details

### API Base URL
`http://localhost:3000/api/v1/wishlist`

### Database Table
- **Table:** `wishlists`
- **Columns:** `id`, `user_id`, `book_id`, `created_at`, `updated_at`
- **Unique Constraint:** Each user can only add a book once

### Frontend Components
- **Service:** `src/app/services/wishlist.service.ts`
- **Component:** `src/app/pages/wishlist/wishlist.component.ts`
- **Model:** `src/app/models/wishlist.model.ts`
- **Route:** `/wishlist`

### Backend Components
- **Controller:** `backend/src/controllers/wishlistController.js`
- **Routes:** `backend/src/routes/wishlist.js`
- **Model:** `backend/src/models/Wishlist.js`

---

## Notes

- Wishlist is **user-specific** - each user has their own wishlist
- Wishlist is **persistent** - saved in database, not lost on logout
- Wishlist is **real-time** - changes reflect immediately
- Wishlist requires **authentication** - must be logged in
- Wishlist uses **signals** - reactive state management with Angular

---

## Related Files

- Backend Controller: `backend/src/controllers/wishlistController.js`
- Backend Routes: `backend/src/routes/wishlist.js`
- Frontend Service: `src/app/services/wishlist.service.ts`
- Frontend Component: `src/app/pages/wishlist/wishlist.component.ts`
- Wishlist Model: `src/app/models/wishlist.model.ts`
- Book Card Component: `src/app/components/book-card/book-card.component.ts`

---

**The wishlist feature is complete and working!** 🎉

**Made with Bob** 🤖