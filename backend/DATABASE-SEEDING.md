# Database Seeding Guide

This guide explains how to populate your database with sample data for the Book Worm e-bookstore application.

## Prerequisites

- PostgreSQL database running
- Database connection configured in `.env` file
- All dependencies installed (`npm install`)

## Seeding the Database

### Option 1: Run the Seed Script (Recommended)

This will **reset all tables** and populate them with fresh sample data:

```bash
npm run seed:data
```

### Option 2: Manual Seeding

If you want to run the seeder directly:

```bash
node src/seeders/seed-data.js
```

## What Gets Seeded

The seeder creates comprehensive sample data for all tables:

### 1. **Users** (4 users)
- Test accounts with hashed passwords
- All passwords: `password123`

### 2. **Categories** (10 categories)
- Fiction, Non-Fiction, Science Fiction, Mystery, Romance
- Biography, Self-Help, Technology, History, Children

### 3. **Books** (10 books)
- Classic novels (The Great Gatsby, 1984, Pride and Prejudice)
- Modern bestsellers (Atomic Habits, Clean Code, Sapiens)
- Children's books (Harry Potter)
- Complete with prices, descriptions, ISBNs, and images

### 4. **Addresses** (4 addresses)
- Multiple addresses per user
- Indian addresses with proper formatting

### 5. **Shopping Carts** (4 carts)
- One cart per user
- Pre-populated with cart items

### 6. **Cart Items** (4 items)
- Books added to various user carts

### 7. **Orders** (3 orders)
- Orders in different states: delivered, shipped, processing
- Complete with order numbers and totals

### 8. **Order Items** (4 items)
- Line items for each order

### 9. **Payments** (3 payments)
- Payment records for orders
- Various payment methods: credit card, UPI, debit card

### 10. **Shipments** (3 shipments)
- Tracking information
- Different shipment statuses

### 11. **Reviews** (5 reviews)
- Book reviews with ratings (1-5 stars)
- Verified purchase flags

### 12. **Wishlists** (6 items)
- Books saved to user wishlists

### 13. **Coupons** (4 coupons)
- Active and expired coupons
- Percentage and fixed discount types
- Example codes: WELCOME10, FLAT50, SUMMER25

### 14. **Gift Points** (4 records)
- Loyalty points for each user
- Earned and redeemed tracking

### 15. **Book Categories** (14 relationships)
- Many-to-many relationships between books and categories

## Test User Credentials

After seeding, you can login with these accounts:

| Email | Password | Name |
|-------|----------|------|
| john.doe@example.com | password123 | John Doe |
| jane.smith@example.com | password123 | Jane Smith |
| bob.wilson@example.com | password123 | Bob Wilson |
| alice.brown@example.com | password123 | Alice Brown |

## Sample Data Summary

After seeding, your database will contain:
- 4 users
- 10 categories
- 10 books
- 4 addresses
- 4 carts with 4 cart items
- 3 orders with 4 order items
- 3 payments
- 3 shipments
- 5 reviews
- 6 wishlist items
- 4 coupons
- 4 gift point records
- 14 book-category relationships

## Important Notes

⚠️ **WARNING**: The seeder uses `sequelize.sync({ force: true })` which will:
- **DROP all existing tables**
- **DELETE all existing data**
- Recreate tables from scratch
- Insert fresh sample data

If you want to preserve existing data, comment out the `force: true` option in [`seed-data.js`](src/seeders/seed-data.js:12) before running.

## Troubleshooting

### Error: "Cannot find module"
Make sure you're in the backend directory:
```bash
cd book-worm/backend
npm install
```

### Error: "Connection refused"
Check that PostgreSQL is running and your `.env` file has correct database credentials.

### Error: "Database does not exist"
Create the database first:
```bash
npm run db:reset
```

## Customizing Sample Data

To modify the sample data, edit [`src/seeders/seed-data.js`](src/seeders/seed-data.js:1) and adjust the data in the `bulkCreate` calls.

## Next Steps

After seeding:
1. Start the backend server: `npm run dev`
2. Test the API endpoints
3. Login with test credentials
4. Explore the sample data through your frontend application