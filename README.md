# 📚 Book Worm E-Bookstore

A complete full-stack e-commerce platform for online book shopping built with Angular and Node.js.

## 🏗️ Project Structure

This is a monorepo containing both frontend and backend applications:

```
book-worm/
├── src/                    # Angular Frontend Application
│   ├── app/
│   ├── styles.css
│   └── index.html
├── backend/                # Node.js + Express Backend API
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── utils/
│   ├── package.json
│   └── README.md
├── openapi.yaml           # API Documentation
├── package.json           # Frontend dependencies
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL >= 14.0
- npm >= 9.0.0

### Frontend Setup

1. **Install dependencies**
```bash
npm install
```

2. **Run development server**
```bash
npm start
```

The frontend will be available at `http://localhost:4200`

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Create PostgreSQL database**
```sql
CREATE DATABASE bookworm;
```

5. **Run backend server**
```bash
npm run dev
```

The API will be available at `http://localhost:3000/api/v1`

## 📖 Documentation

- **Frontend**: Angular 18 application with Tailwind CSS
- **Backend**: See [`backend/README.md`](backend/README.md) for detailed API documentation
- **API Specification**: See [`openapi.yaml`](openapi.yaml) for complete OpenAPI 3.0 specification

## 🎯 Features

### Frontend
- ✅ User authentication (Login/Signup)
- ✅ Book browsing and search
- ✅ Shopping cart management
- ✅ Wishlist functionality
- ✅ Order placement and tracking
- ✅ User profile management
- ✅ Responsive design with Tailwind CSS

### Backend API
- ✅ RESTful API with 40+ endpoints
- ✅ JWT authentication
- ✅ PostgreSQL database with Sequelize ORM
- ✅ Complete e-commerce functionality
- ✅ Payment processing
- ✅ Order management
- ✅ Review system
- ✅ Coupon validation
- ✅ Gift points system

## 🔧 Development

### Frontend Development
```bash
npm start              # Start dev server
npm run build          # Build for production
npm test               # Run tests
```

### Backend Development
```bash
cd backend
npm run dev            # Start with nodemon
npm start              # Start production server
npm run migrate        # Run database migrations
npm run seed           # Seed database
npm test               # Run tests
```

## 📦 Tech Stack

### Frontend
- **Framework**: Angular 18
- **Styling**: Tailwind CSS
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router
- **State Management**: Angular Signals

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT + bcryptjs
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting

## 🌐 API Endpoints

See [`openapi.yaml`](openapi.yaml) for complete API documentation.

### Main Endpoint Categories:
- `/api/v1/auth` - Authentication
- `/api/v1/books` - Book catalog
- `/api/v1/categories` - Categories
- `/api/v1/cart` - Shopping cart
- `/api/v1/wishlist` - Wishlist
- `/api/v1/orders` - Orders
- `/api/v1/payments` - Payments
- `/api/v1/addresses` - User addresses
- `/api/v1/reviews` - Book reviews
- `/api/v1/coupons` - Coupon validation
- `/api/v1/shipments` - Order tracking
- `/api/v1/gift-points` - Gift points

## 🔒 Security

- Password hashing with bcryptjs
- JWT token-based authentication
- Rate limiting to prevent abuse
- CORS configuration
- Helmet for security headers
- Input validation and sanitization
- SQL injection protection via ORM

## 📝 Environment Variables

### Frontend
Configure in `src/environments/`:
- API endpoint URL
- Environment-specific settings

### Backend
See `backend/.env.example` for all required variables:
- Database credentials
- JWT secrets
- CORS origins
- Rate limiting settings
- Payment gateway keys

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
# Deploy dist/ folder to your hosting service
```

### Backend Deployment
```bash
cd backend
npm install --production
npm start
# Or use PM2: pm2 start src/server.js
```

## 📄 License

MIT License - see LICENSE file for details

## 👥 Contributors

Book Worm Development Team

## 📞 Support

For support, email support@bookworm.com

---

Made with ❤️ by the Book Worm Team
