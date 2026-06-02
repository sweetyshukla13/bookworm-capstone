# Book Worm E-Bookstore Backend API

Complete Node.js + Express REST API backend for the Book Worm E-Bookstore platform with PostgreSQL database.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with refresh tokens
- **Complete E-commerce Flow**: Books, Cart, Orders, Payments
- **User Management**: Profiles, Addresses, Wishlist
- **Reviews & Ratings**: Book reviews with verified purchase badges
- **Coupons & Gift Points**: Discount system and loyalty rewards
- **Order Tracking**: Real-time shipment tracking
- **PostgreSQL Database**: Robust relational database with Sequelize ORM
- **Security**: Helmet, CORS, Rate Limiting, Input Validation
- **API Documentation**: OpenAPI 3.0 specification included

## 📋 Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 14.0
- npm >= 9.0.0

## 🛠️ Installation

1. **Clone the repository**
```bash
cd book-worm-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Create PostgreSQL database**
```sql
CREATE DATABASE bookworm;
```

5. **Run migrations**
```bash
npm run migrate
```

6. **Seed database (optional)**
```bash
npm run seed
```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The API will be available at `http://localhost:3000/api/v1`

## 📁 Project Structure

```
book-worm-backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Database configuration
│   │   ├── jwt.js               # JWT configuration
│   │   └── app.js               # App configuration
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Book.js              # Book model
│   │   ├── Category.js          # Category model
│   │   ├── Cart.js              # Cart model
│   │   ├── CartItem.js          # Cart item model
│   │   ├── Order.js             # Order model
│   │   ├── OrderItem.js         # Order item model
│   │   ├── Address.js           # Address model
│   │   ├── Review.js            # Review model
│   │   ├── Payment.js           # Payment model
│   │   ├── Shipment.js          # Shipment model
│   │   ├── Coupon.js            # Coupon model
│   │   ├── GiftPoints.js        # Gift points model
│   │   ├── Wishlist.js          # Wishlist model
│   │   └── index.js             # Model associations
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── bookController.js    # Book operations
│   │   ├── cartController.js    # Cart operations
│   │   ├── orderController.js   # Order operations
│   │   ├── paymentController.js # Payment processing
│   │   ├── addressController.js # Address management
│   │   ├── reviewController.js  # Review operations
│   │   ├── couponController.js  # Coupon validation
│   │   ├── shipmentController.js# Shipment tracking
│   │   ├── wishlistController.js# Wishlist operations
│   │   └── giftPointsController.js # Gift points
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── books.js             # Book routes
│   │   ├── categories.js        # Category routes
│   │   ├── cart.js              # Cart routes
│   │   ├── orders.js            # Order routes
│   │   ├── payments.js          # Payment routes
│   │   ├── addresses.js         # Address routes
│   │   ├── reviews.js           # Review routes
│   │   ├── coupons.js           # Coupon routes
│   │   ├── shipments.js         # Shipment routes
│   │   ├── wishlist.js          # Wishlist routes
│   │   ├── giftPoints.js        # Gift points routes
│   │   └── index.js             # Route aggregator
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── validate.js          # Input validation
│   │   ├── errorHandler.js      # Error handling
│   │   ├── rateLimiter.js       # Rate limiting
│   │   └── logger.js            # Request logging
│   ├── utils/
│   │   ├── jwt.js               # JWT utilities
│   │   ├── password.js          # Password hashing
│   │   ├── pagination.js        # Pagination helper
│   │   ├── response.js          # Response formatter
│   │   └── validators.js        # Custom validators
│   ├── migrations/
│   │   ├── 001-create-users.js
│   │   ├── 002-create-categories.js
│   │   ├── 003-create-books.js
│   │   ├── 004-create-addresses.js
│   │   ├── 005-create-carts.js
│   │   ├── 006-create-orders.js
│   │   ├── 007-create-payments.js
│   │   ├── 008-create-reviews.js
│   │   ├── 009-create-coupons.js
│   │   ├── 010-create-shipments.js
│   │   ├── 011-create-wishlist.js
│   │   ├── 012-create-gift-points.js
│   │   ├── run.js               # Migration runner
│   │   └── seed.js              # Database seeder
│   ├── app.js                   # Express app setup
│   └── server.js                # Server entry point
├── tests/
│   ├── auth.test.js
│   ├── books.test.js
│   └── ...
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/profile` - Get user profile

### Books
- `GET /api/v1/books` - Get all books (with filters)
- `GET /api/v1/books/:id` - Get book by ID
- `GET /api/v1/books/:id/related` - Get related books
- `GET /api/v1/books/sections` - Get book sections

### Categories
- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/categories/:id/books` - Get books by category

### Cart
- `GET /api/v1/cart` - Get user's cart
- `POST /api/v1/cart/items` - Add item to cart
- `PATCH /api/v1/cart/items/:itemId` - Update cart item
- `DELETE /api/v1/cart/items/:itemId` - Remove cart item
- `DELETE /api/v1/cart` - Clear cart

### Wishlist
- `GET /api/v1/wishlist` - Get user's wishlist
- `POST /api/v1/wishlist` - Add to wishlist
- `DELETE /api/v1/wishlist/:bookId` - Remove from wishlist

### Orders
- `GET /api/v1/orders` - Get order history
- `GET /api/v1/orders/:id` - Get order details
- `POST /api/v1/orders` - Create order
- `PATCH /api/v1/orders/:id/cancel` - Cancel order
- `POST /api/v1/orders/:id/return` - Request return

### Payments
- `POST /api/v1/payments` - Initiate payment
- `GET /api/v1/payments/:id` - Get payment status
- `POST /api/v1/payments/:id/refund` - Request refund

### Addresses
- `GET /api/v1/addresses` - Get saved addresses
- `POST /api/v1/addresses` - Add address
- `PUT /api/v1/addresses/:id` - Update address
- `DELETE /api/v1/addresses/:id` - Delete address
- `PATCH /api/v1/addresses/:id/default` - Set default

### Reviews
- `GET /api/v1/books/:id/reviews` - Get book reviews
- `POST /api/v1/books/:id/reviews` - Submit review
- `DELETE /api/v1/reviews/:id` - Delete review

### Coupons
- `POST /api/v1/coupons/validate` - Validate coupon

### Shipments
- `GET /api/v1/shipments/:orderId` - Get tracking info

### Gift Points
- `GET /api/v1/gift-points` - Get points balance
- `POST /api/v1/gift-points/redeem` - Redeem points

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📊 Database Schema

### Users Table
- id (UUID, PK)
- email (VARCHAR, UNIQUE)
- password (VARCHAR, hashed)
- name (VARCHAR)
- phone (VARCHAR)
- created_at, updated_at

### Books Table
- id (UUID, PK)
- title (VARCHAR)
- author (VARCHAR)
- price (DECIMAL)
- original_price (DECIMAL)
- cover_image (TEXT)
- description (TEXT)
- category_id (UUID, FK)
- format (ENUM)
- language (VARCHAR)
- rating (DECIMAL)
- review_count (INTEGER)
- isbn (VARCHAR)
- publisher (VARCHAR)
- pages (INTEGER)
- in_stock (BOOLEAN)
- stock_quantity (INTEGER)
- created_at, updated_at

### Orders Table
- id (UUID, PK)
- user_id (UUID, FK)
- order_number (VARCHAR, UNIQUE)
- status (ENUM)
- subtotal (DECIMAL)
- tax (DECIMAL)
- delivery_charges (DECIMAL)
- discount (DECIMAL)
- total (DECIMAL)
- address_id (UUID, FK)
- payment_method (ENUM)
- payment_status (ENUM)
- tracking_number (VARCHAR)
- created_at, updated_at

[Additional tables: Categories, Cart, CartItems, OrderItems, Addresses, Reviews, Payments, Shipments, Coupons, GiftPoints, Wishlist]

## 🧪 Testing

```bash
npm test
```

## 🔐 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevent brute force attacks
- **Input Validation**: express-validator
- **SQL Injection Protection**: Sequelize ORM
- **XSS Protection**: Helmet middleware
- **CORS**: Configurable origins

## 📝 Environment Variables

See `.env.example` for all required environment variables.

## 🚀 Deployment

### Using PM2
```bash
npm install -g pm2
pm2 start src/server.js --name bookworm-api
```

### Using Docker
```bash
docker build -t bookworm-api .
docker run -p 3000:3000 bookworm-api
```

## 📄 License

MIT License - see LICENSE file for details

## 👥 Contributors

Book Worm Development Team

## 📞 Support

For support, email support@bookworm.com