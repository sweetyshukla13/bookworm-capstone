# Wishlist Feature - Complete Implementation Guide

## Overview

The wishlist feature allows users to save books they're interested in for later purchase. Users can add/remove books from their wishlist, view all wishlist items, and quickly add them to cart.

## Features Implemented

### Backend (Node.js/Express + Sequelize)

1. **Wishlist Controller** (`backend/src/controllers/wishlistController.js`)
   - `getUserWishlist()` - Get all wishlist items for user
   - `addToWishlist()` - Add book to wishlist
   - `removeFromWishlist()` - Remove book from wishlist
   - `checkWishlistStatus()` - Check if book is in wishlist
   - `clearWishlist()` - Clear entire wishlist

2. **Wishlist Routes** (`backend/src/routes/wishlist.js`)
   - `GET /api/v1/wishlist` - Get user's wishlist
   - `POST /api/v1/wishlist` - Add book to wishlist
   - `GET /api/v1/wishlist/check/:bookId` - Check wishlist status
   - `DELETE /api/v1/wishlist/:bookId` - Remove from wishlist
   - `DELETE /api/v1/wishlist` - Clear wishlist

3. **Authentication**
   - All wishlist routes require JWT authentication
   - Uses `authenticateToken` middleware

### Frontend (Angular)

1. **Wishlist Model** (`src/app/models/wishlist.model.ts`)
   - WishlistItem interface
   - WishlistResponse interface
   - WishlistStatusResponse interface

2. **Wishlist Service** (`src/app/services/wishlist.service.ts`)
   - `loadWishlist()` - Load wishlist from API
   - `getUserWishlist()` - Fetch user wishlist
   - `addToWishlist()` - Add book to wishlist
   - `removeFromWishlist()` - Remove book from wishlist
   - `toggleWishlist()` - Toggle wishlist status
   - `isInWishlist()` - Check if book is in wishlist
   - `clearWishlist()` - Clear entire wishlist
   - Signals for reactive state management

3. **Wishlist Button in Book Cards** (`src/app/components/book-card/`)
   - Heart icon button on each book card
   - Red when in wishlist, gray when not
   - Click to toggle wishlist status
   - Requires authentication

4. **Wishlist Page** (`src/app/pages/wishlist/`)
   - Display all wishlist items
   - Add to cart functionality
   - Remove from wishlist
   - View book details
   - Clear entire wishlist
   - Wishlist summary with total value and savings

5. **Navigation**
   - "My Wishlist" link in header navigation
   - Route: `/wishlist`

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

## How to Use

### For Users

#### Adding to Wishlist
1. **From Book Card:**
   - Click the heart icon in the top-right corner of any book card
   - Icon turns red when added to wishlist
   - Click again to remove from wishlist

2. **From Book Detail Page:**
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

#### Reactive State Management

The wishlist service uses Angular signals for reactive state:

```typescript
// Access wishlist items
const items = this.wishlistService.wishlistItems();

// Access wishlist count
const count = this.wishlistService.wishlistCount();

// These automatically update when wishlist changes
```

## Features

### ✅ Implemented
- Add/remove books from wishlist
- Heart icon on book cards
- Wishlist page with all items
- Add to cart from wishlist
- Clear entire wishlist
- Wishlist count tracking
- Authentication required
- Duplicate prevention
- Reactive state management

### 🔄 Potential Enhancements
1. **Wishlist Sharing** - Share wishlist with friends
2. **Price Alerts** - Notify when wishlist items go on sale
3. **Move to Cart** - Move item from wishlist to cart (removes from wishlist)
4. **Wishlist Collections** - Organize wishlist into categories
5. **Priority Levels** - Mark items as high/medium/low priority
6. **Notes** - Add personal notes to wishlist items
7. **Wishlist Analytics** - Track most wishlisted books

## Database Relationships

```
User (1) ----< (N) Wishlist (N) >---- (1) Book

One user can have many wishlist items
One book can be in many users' wishlists
Each wishlist entry is unique per user-book combination
```

## Security

- All endpoints require JWT authentication
- Users can only access their own wishlist
- Duplicate entries prevented at database level
- User ID automatically extracted from JWT token

## Testing

### Test Adding to Wishlist
```bash
curl -X POST http://localhost:3000/api/v1/wishlist \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"bookId": "BOOK_UUID"}'
```

### Test Getting Wishlist
```bash
curl -X GET http://localhost:3000/api/v1/wishlist \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Removing from Wishlist
```bash
curl -X DELETE http://localhost:3000/api/v1/wishlist/BOOK_UUID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### Wishlist Not Loading
- Verify user is authenticated
- Check JWT token is valid
- Ensure wishlist table exists in database

### Cannot Add to Wishlist
- Check if book exists
- Verify book is not already in wishlist
- Check authentication token

### Heart Icon Not Updating
- Ensure WishlistService is properly injected
- Check that signals are being used correctly
- Verify API responses are successful

## UI/UX Features

1. **Visual Feedback**
   - Heart icon changes color (gray → red)
   - Hover effects on buttons
   - Loading states
   - Success/error messages

2. **Empty State**
   - Friendly message when wishlist is empty
   - "Browse Books" button to start shopping

3. **Responsive Design**
   - Works on mobile, tablet, and desktop
   - Touch-friendly buttons
   - Adaptive layouts

4. **Accessibility**
   - Proper ARIA labels
   - Keyboard navigation support
   - Screen reader friendly

## Related Files

- Backend Controller: [`backend/src/controllers/wishlistController.js`](backend/src/controllers/wishlistController.js:1)
- Backend Routes: [`backend/src/routes/wishlist.js`](backend/src/routes/wishlist.js:1)
- Frontend Service: [`src/app/services/wishlist.service.ts`](src/app/services/wishlist.service.ts:1)
- Frontend Component: [`src/app/pages/wishlist/wishlist.component.ts`](src/app/pages/wishlist/wishlist.component.ts:1)
- Wishlist Model: [`src/app/models/wishlist.model.ts`](src/app/models/wishlist.model.ts:1)
- Book Card Component: [`src/app/components/book-card/book-card.component.ts`](src/app/components/book-card/book-card.component.ts:1)

---

**Made with Bob**