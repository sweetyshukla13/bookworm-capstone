# Quick Start Guide - Coupon API Backend

## Prerequisites
- Node.js >= 18.0.0
- PostgreSQL >= 14.0
- npm >= 9.0.0

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database
Edit the `.env` file with your PostgreSQL credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookworm
DB_USER=postgres
DB_PASSWORD=your_password
```

### 3. Create Database
Open PostgreSQL and run:
```sql
CREATE DATABASE bookworm;
```

### 4. Run Migrations
```bash
npm run migrate
```

This will create the `coupons` table in your database.

### 5. Seed Sample Coupons
```bash
npm run seed
```

This will add 6 sample coupons to test with.

### 6. Start the Server
```bash
npm run dev
```

The API will be available at: `http://localhost:3000/api/v1`

## Test the API

### Health Check
```bash
curl http://localhost:3000/health
```

### Validate a Coupon
```bash
curl -X POST http://localhost:3000/api/v1/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{"code": "WELCOME10", "orderAmount": 500}'
```

### Get All Active Coupons
```bash
curl http://localhost:3000/api/v1/coupons
```

## Sample Coupons Available

| Code | Type | Discount | Min Order | Description |
|------|------|----------|-----------|-------------|
| WELCOME10 | Percentage | 10% | ₹299 | Welcome offer |
| SAVE20 | Percentage | 20% | ₹500 | Save 20% |
| FLAT50 | Fixed | ₹50 | ₹200 | Flat discount |
| MEGA30 | Percentage | 30% | ₹1000 | Mega sale |
| FLAT100 | Fixed | ₹100 | ₹800 | Flat discount |
| BOOKWORM15 | Percentage | 15% | ₹400 | Special offer |

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check credentials in `.env` file
- Ensure database `bookworm` exists

### Port Already in Use
Change the PORT in `.env`:
```env
PORT=3001
```

### Migration Errors
If migrations fail, check:
1. Database exists
2. User has proper permissions
3. No existing `coupons` table

## API Endpoints

- `POST /api/v1/coupons/validate` - Validate coupon
- `GET /api/v1/coupons` - Get all active coupons
- `POST /api/v1/coupons/:id/use` - Increment usage count
- `GET /health` - Health check

For detailed API documentation, see [`COUPON-IMPLEMENTATION.md`](../COUPON-IMPLEMENTATION.md)