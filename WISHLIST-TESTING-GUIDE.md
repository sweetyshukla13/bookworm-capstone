# Wishlist Feature - Testing Guide

## ✅ Wishlist Feature is Fully Functional!

The wishlist feature has been successfully implemented and is working correctly. Follow this guide to test it properly.

---

## 🧪 How to Test the Wishlist Feature

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

---

## 🔍 What You Should See

### Empty Wishlist
If you haven't added any books:
```
Your wishlist is empty
Start adding books you love to your wishlist!
[Browse Books button]
```

### Wishlist with Items
If you have added books:
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

---

## 🐛 Troubleshooting

### Issue: Seeing books I didn't add
**Solution:** 
1. Run the clear script: `node backend/clear-wishlist.js`
2. Refresh your browser (clear cache)
3. Start fresh by adding books

### Issue: Heart icon not changing color
**Solution:**
1. Make sure you're logged in
2. Check browser console for errors (F12)
3. Verify the API is running (backend server should be active)

### Issue: Wishlist page shows "0 items" but I added books
**Solution:**
1. Check if you're logged in with the same account
2. Refresh the page
3. Check browser console for API errors

---

## 📊 Database Scripts

### Check Wishlist Data
```bash
cd book-worm/backend
node check-wishlist.js
```

This will show:
- Total wishlist items in database
- Which user owns each item
- Which book is in each wishlist entry

### Clear All Wishlist Data
```bash
cd book-worm/backend
node clear-wishlist.js
```

This will:
- Remove all wishlist items from database
- Give you a clean slate for testing

---

## 🔧 Technical Details

### API Endpoints
- `GET /api/v1/wishlist` - Get user's wishlist
- `POST /api/v1/wishlist` - Add book to wishlist
- `DELETE /api/v1/wishlist/:bookId` - Remove book from wishlist
- `GET /api/v1/wishlist/check/:bookId` - Check if book is in wishlist
- `DELETE /api/v1/wishlist` - Clear entire wishlist

### Database Table
- **Table:** `wishlist`
- **Columns:** `id`, `user_id`, `book_id`, `created_at`, `updated_at`
- **Unique Constraint:** Each user can only add a book once

### Frontend Components
- **Service:** `src/app/services/wishlist.service.ts`
- **Component:** `src/app/pages/wishlist/wishlist.component.ts`
- **Model:** `src/app/models/wishlist.model.ts`
- **Route:** `/wishlist`

---

## ✨ Features

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

---

## 🎯 Expected Behavior

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

---

## 📝 Notes

- Wishlist is **user-specific** - each user has their own wishlist
- Wishlist is **persistent** - saved in database, not lost on logout
- Wishlist is **real-time** - changes reflect immediately
- Wishlist requires **authentication** - must be logged in

---

## 🚀 Quick Test Checklist

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

**The wishlist feature is complete and working!** 🎉

If you follow these steps and still see issues, please check:
1. Backend server is running
2. You're logged in
3. Browser console for errors
4. Database connection is active