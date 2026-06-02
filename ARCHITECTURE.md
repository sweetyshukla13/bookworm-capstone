# 🏗️ Book Worm E-Bookstore - Architecture Documentation

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER (Browser)                          │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │              Angular 18 Frontend Application                     │   │
│  │                    (Port: 4200)                                  │   │
│  │                                                                   │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │   │
│  │  │  Pages   │  │Components│  │ Services │  │  Models  │       │   │
│  │  │          │  │          │  │          │  │          │       │   │
│  │  │ • Home   │  │ • Header │  │ • Auth   │  │ • User   │       │   │
│  │  │ • Login  │  │ • Sidebar│  │ • Book   │  │ • Book   │       │   │
│  │  │ • Signup │  │ • Card   │  │ • Cart   │  │ • Coupon │       │   │
│  │  │ • Cart   │  │          │  │          │  │          │       │   │
│  │  │ • Payment│  │          │  │          │  │          │       │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │   │
│  │                                                                   │   │
│  │  ┌────────────────────────────────────────────────────────┐    │   │
│  │  │         Interceptors & Guards                           │    │   │
│  │  │  • Auth Interceptor (JWT Token Management)              │    │   │
│  │  │  • HTTP Error Handling                                  │    │   │
│  │  └────────────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/HTTPS
                                    │ REST API Calls
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                                 │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │           Node.js + Express Backend API                          │   │
│  │                  (Port: 3000)                                    │   │
│  │                                                                   │   │
│  │  ┌────────────────────────────────────────────────────────┐    │   │
│  │  │                  Middleware Layer                       │    │   │
│  │  │  • CORS          • Helmet       • Rate Limiter          │    │   │
│  │  │  • Body Parser   • Auth JWT     • Error Handler        │    │   │
│  │  └────────────────────────────────────────────────────────┘    │   │
│  │                            │                                     │   │
│  │  ┌────────────────────────────────────────────────────────┐    │   │
│  │  │                   Routes Layer                          │    │   │
│  │  │  /api/v1/                                               │    │   │
│  │  │  ├── /auth          (Authentication)                    │    │   │
│  │  │  ├── /books         (Book Catalog)                      │    │   │
│  │  │  ├── /categories    (Categories)                        │    │   │
│  │  │  ├── /cart          (Shopping Cart)                     │    │   │
│  │  │  ├── /wishlist      (Wishlist)                          │    │   │
│  │  │  ├── /orders        (Order Management)                  │    │   │
│  │  │  ├── /payments      (Payment Processing)                │    │   │
│  │  │  ├── /addresses     (User Addresses)                    │    │   │
│  │  │  ├── /reviews       (Book Reviews)                      │    │   │
│  │  │  ├── /coupons       (Coupon Validation)                 │    │   │
│  │  │  ├── /shipments     (Order Tracking)                    │    │   │
│  │  │  └── /gift-points   (Loyalty Points)                    │    │   │
│  │  └────────────────────────────────────────────────────────┘    │   │
│  │                            │                                     │   │
│  │  ┌────────────────────────────────────────────────────────┐    │   │
│  │  │                Controllers Layer                        │    │   │
│  │  │  • authController      • orderController                │    │   │
│  │  │  • bookController      • paymentController              │    │   │
│  │  │  • cartController      • reviewController               │    │   │
│  │  │  • couponController    • shipmentController             │    │   │
│  │  │  • wishlistController  • giftPointsController           │    │   │
│  │  └────────────────────────────────────────────────────────┘    │   │
│  │                            │                                     │   │
│  │  ┌────────────────────────────────────────────────────────┐    │   │
│  │  │                  Models Layer (ORM)                     │    │   │
│  │  │  Sequelize Models with Associations:                    │    │   │
│  │  │  • User          • Order         • Coupon               │    │   │
│  │  │  • Book          • OrderItem     • GiftPoint            │    │   │
│  │  │  • Category      • Payment       • Wishlist             │    │   │
│  │  │  • Cart          • Shipment      • BookCategory         │    │   │
│  │  │  • CartItem      • Review                               │    │   │
│  │  │  • Address                                              │    │   │
│  │  └────────────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ SQL Queries
                                    │ (Sequelize ORM)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                                      │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    PostgreSQL Database                           │   │
│  │                                                                   │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │   │
│  │  │  users   │  │  books   │  │  orders  │  │ payments │       │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │   │
│  │                                                                   │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │   │
│  │  │categories│  │   cart   │  │ reviews  │  │ coupons  │       │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │   │
│  │                                                                   │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │   │
│  │  │addresses │  │ wishlist │  │shipments │  │gift_pts  │       │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Architecture (Angular)

```
src/
├── app/
│   ├── components/              # Reusable UI Components
│   │   ├── header/             # Navigation header
│   │   ├── sidebar/            # Category sidebar
│   │   └── book-card/          # Book display card
│   │
│   ├── pages/                  # Route Components
│   │   ├── home/               # Landing page
│   │   ├── login/              # User login
│   │   ├── signup/             # User registration
│   │   ├── book-detail/        # Book details
│   │   ├── cart/               # Shopping cart
│   │   ├── payment/            # Payment processing
│   │   └── payment-success/    # Order confirmation
│   │
│   ├── services/               # Business Logic
│   │   ├── auth.service.ts     # Authentication
│   │   └── book.service.ts     # Book operations
│   │
│   ├── models/                 # TypeScript Interfaces
│   │   ├── user.model.ts       # User interface
│   │   ├── book.model.ts       # Book interface
│   │   └── coupon.model.ts     # Coupon interface
│   │
│   ├── interceptors/           # HTTP Interceptors
│   │   └── auth.interceptor.ts # JWT token injection
│   │
│   └── app.routes.ts           # Route configuration
│
└── environments/               # Environment configs
    ├── environment.ts          # Development
    └── environment.prod.ts     # Production
```

### Backend Architecture (Node.js + Express)

```
backend/src/
├── config/                     # Configuration
│   └── database.js            # Database connection
│
├── models/                     # Database Models (Sequelize)
│   ├── User.js                # User model
│   ├── Book.js                # Book model
│   ├── Category.js            # Category model
│   ├── Cart.js                # Cart model
│   ├── CartItem.js            # Cart item model
│   ├── Order.js               # Order model
│   ├── OrderItem.js           # Order item model
│   ├── Payment.js             # Payment model
│   ├── Address.js             # Address model
│   ├── Review.js              # Review model
│   ├── Shipment.js            # Shipment model
│   ├── Coupon.js              # Coupon model
│   ├── GiftPoint.js           # Gift points model
│   ├── Wishlist.js            # Wishlist model
│   └── index.js               # Model associations
│
├── controllers/                # Business Logic
│   ├── authController.js      # Authentication logic
│   ├── bookController.js      # Book operations
│   ├── cartController.js      # Cart operations
│   ├── orderController.js     # Order management
│   ├── paymentController.js   # Payment processing
│   ├── reviewController.js    # Review operations
│   ├── couponController.js    # Coupon validation
│   ├── shipmentController.js  # Shipment tracking
│   └── wishlistController.js  # Wishlist operations
│
├── routes/                     # API Routes
│   ├── auth.js                # Auth endpoints
│   ├── books.js               # Book endpoints
│   ├── coupons.js             # Coupon endpoints
│   └── index.js               # Route aggregator
│
├── middleware/                 # Middleware
│   ├── auth.js                # JWT authentication
│   ├── errorHandler.js        # Error handling
│   └── rateLimiter.js         # Rate limiting
│
├── migrations/                 # Database Migrations
│   ├── seed.js                # Data seeding
│   └── run.js                 # Migration runner
│
├── app.js                      # Express app setup
└── server.js                   # Server entry point
```

## Data Flow Architecture

### Authentication Flow

```
┌─────────┐         ┌──────────┐         ┌────────────┐         ┌──────────┐
│ Client  │────────▶│  Login   │────────▶│   Auth     │────────▶│   User   │
│ Browser │         │Component │         │ Controller │         │  Model   │
└─────────┘         └──────────┘         └────────────┘         └──────────┘
     │                                           │                      │
     │                                           │                      │
     │              ┌──────────────────────────┐│                      │
     │◀─────────────│  JWT Token Generated     ││                      │
     │              └──────────────────────────┘│                      │
     │                                           │                      │
     │              ┌──────────────────────────┐│                      │
     │◀─────────────│  Store in localStorage   ││                      │
     │              └──────────────────────────┘│                      │
     │                                           ▼                      ▼
     │              ┌────────────────────────────────────────────────────┐
     │              │  All subsequent requests include JWT in header     │
     │              │  Authorization: Bearer <token>                     │
     │              └────────────────────────────────────────────────────┘
```

### Book Purchase Flow

```
1. Browse Books
   ├─▶ GET /api/v1/books
   └─▶ Display book catalog

2. Add to Cart
   ├─▶ POST /api/v1/cart/items
   └─▶ Update cart state

3. View Cart
   ├─▶ GET /api/v1/cart
   └─▶ Display cart items

4. Apply Coupon (Optional)
   ├─▶ POST /api/v1/coupons/validate
   └─▶ Calculate discount

5. Checkout
   ├─▶ Select/Add address
   ├─▶ POST /api/v1/orders
   └─▶ Create order

6. Payment
   ├─▶ POST /api/v1/payments
   ├─▶ Process payment
   └─▶ Update order status

7. Confirmation
   ├─▶ GET /api/v1/orders/:id
   ├─▶ Clear cart
   └─▶ Display success page
```

## Database Schema Relationships

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│   User   │────────▶│   Cart   │────────▶│CartItem  │
└──────────┘         └──────────┘         └──────────┘
     │                                           │
     │                                           │
     │                                           ▼
     │                                     ┌──────────┐
     │                                     │   Book   │
     │                                     └──────────┘
     │                                           │
     │                                           │
     ├──────────────────────────────────────────┤
     │                                           │
     ▼                                           ▼
┌──────────┐                              ┌──────────┐
│  Order   │                              │ Category │
└──────────┘                              └──────────┘
     │
     │
     ├─────────────┬─────────────┬─────────────┐
     │             │             │             │
     ▼             ▼             ▼             ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│OrderItem │ │ Payment  │ │ Shipment │ │ Address  │
└──────────┘ └──────────┘ └──────────┘ └──────────┘

Additional Relationships:
├─ User ──▶ Wishlist ──▶ Book
├─ User ──▶ Review ──▶ Book
├─ User ──▶ Address (multiple)
├─ User ──▶ GiftPoint
└─ Order ──▶ Coupon (optional)
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Transport Layer                                          │
│     └─▶ HTTPS/TLS Encryption                                │
│                                                               │
│  2. Application Layer                                        │
│     ├─▶ CORS (Cross-Origin Resource Sharing)                │
│     ├─▶ Helmet (Security Headers)                           │
│     ├─▶ Rate Limiting (Prevent DDoS)                        │
│     └─▶ Input Validation (express-validator)                │
│                                                               │
│  3. Authentication Layer                                     │
│     ├─▶ JWT Token-based Authentication                      │
│     ├─▶ Password Hashing (bcryptjs)                         │
│     └─▶ Token Expiration & Refresh                          │
│                                                               │
│  4. Authorization Layer                                      │
│     ├─▶ Role-based Access Control                           │
│     └─▶ Resource Ownership Verification                     │
│                                                               │
│  5. Data Layer                                               │
│     ├─▶ SQL Injection Prevention (Sequelize ORM)            │
│     ├─▶ Parameterized Queries                               │
│     └─▶ Database Connection Pooling                         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## API Architecture

### RESTful API Design

```
Resource-Based URLs:
├── /api/v1/auth
│   ├── POST   /register      (Create user)
│   ├── POST   /login         (Authenticate)
│   └── GET    /profile       (Get user info)
│
├── /api/v1/books
│   ├── GET    /              (List all books)
│   ├── GET    /:id           (Get book details)
│   └── GET    /:id/related   (Get related books)
│
├── /api/v1/cart
│   ├── GET    /              (Get cart)
│   ├── POST   /items         (Add to cart)
│   ├── PATCH  /items/:id     (Update quantity)
│   └── DELETE /items/:id     (Remove item)
│
├── /api/v1/orders
│   ├── GET    /              (List orders)
│   ├── GET    /:id           (Get order details)
│   ├── POST   /              (Create order)
│   └── PATCH  /:id/cancel    (Cancel order)
│
└── /api/v1/payments
    ├── POST   /              (Process payment)
    ├── GET    /:id           (Get payment status)
    └── POST   /:id/refund    (Request refund)
```

## Technology Stack

### Frontend Stack
```
┌─────────────────────────────────────┐
│ Angular 18                          │
│  ├─ TypeScript                      │
│  ├─ RxJS (Reactive Programming)     │
│  ├─ Angular Router                  │
│  └─ Angular HttpClient              │
├─────────────────────────────────────┤
│ Tailwind CSS                        │
│  └─ Utility-first CSS Framework     │
├─────────────────────────────────────┤
│ Build Tools                         │
│  ├─ Angular CLI                     │
│  ├─ Webpack                         │
│  └─ TypeScript Compiler             │
└─────────────────────────────────────┘
```

### Backend Stack
```
┌─────────────────────────────────────┐
│ Node.js (Runtime)                   │
│  └─ JavaScript/ES6+                 │
├─────────────────────────────────────┤
│ Express.js (Web Framework)          │
│  ├─ Middleware Pipeline             │
│  └─ Routing System                  │
├─────────────────────────────────────┤
│ PostgreSQL (Database)               │
│  └─ Sequelize ORM                   │
├─────────────────────────────────────┤
│ Security & Utilities                │
│  ├─ bcryptjs (Password Hashing)     │
│  ├─ jsonwebtoken (JWT)              │
│  ├─ helmet (Security Headers)       │
│  ├─ cors (CORS Handling)            │
│  ├─ express-validator (Validation)  │
│  └─ express-rate-limit (Rate Limit) │
└─────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Production Environment                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │   Frontend   │         │   Backend    │                  │
│  │   (Static)   │         │   (Node.js)  │                  │
│  │              │         │              │                  │
│  │  • Nginx     │         │  • PM2       │                  │
│  │  • CDN       │         │  • Cluster   │                  │
│  │  • Gzip      │         │  • Load Bal. │                  │
│  └──────────────┘         └──────────────┘                  │
│         │                         │                          │
│         │                         │                          │
│         └─────────┬───────────────┘                          │
│                   │                                          │
│                   ▼                                          │
│         ┌──────────────────┐                                │
│         │   PostgreSQL     │                                │
│         │   Database       │                                │
│         │                  │                                │
│         │  • Replication   │                                │
│         │  • Backup        │                                │
│         │  • Connection    │                                │
│         │    Pooling       │                                │
│         └──────────────────┘                                │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Performance Optimization

### Frontend Optimizations
- Lazy loading of routes
- OnPush change detection strategy
- Image optimization and lazy loading
- Bundle size optimization
- Service worker for caching (PWA ready)

### Backend Optimizations
- Database connection pooling
- Query optimization with indexes
- Response caching
- Rate limiting
- Compression middleware
- Pagination for large datasets

## Monitoring & Logging

```
┌─────────────────────────────────────┐
│         Logging Strategy            │
├─────────────────────────────────────┤
│                                     │
│  Application Logs                   │
│  ├─ Request/Response logging        │
│  ├─ Error tracking                  │
│  └─ Performance metrics             │
│                                     │
│  Database Logs                      │
│  ├─ Query performance               │
│  ├─ Connection pool status          │
│  └─ Transaction logs                │
│                                     │
│  Security Logs                      │
│  ├─ Authentication attempts         │
│  ├─ Authorization failures          │
│  └─ Rate limit violations           │
│                                     │
└─────────────────────────────────────┘
```

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- JWT tokens (no server-side sessions)
- Database connection pooling
- Load balancer ready

### Vertical Scaling
- Efficient database queries
- Caching strategies
- Resource optimization
- Memory management

---

**Last Updated**: 2026-06-01  
**Version**: 1.0.0  
**Maintained By**: Book Worm Development Team