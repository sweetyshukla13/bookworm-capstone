# Book Worm API - Quick Start Guide

## ✅ API Status: WORKING

The API is running successfully on `http://localhost:3000`

## 🎯 Available Endpoints

### Health Checks
- **Server Health**: `GET http://localhost:3000/health`
- **API Health**: `GET http://localhost:3000/api/v1/health`

### Books
- **List Books**: `GET http://localhost:3000/api/v1/books`
- **Get Book**: `GET http://localhost:3000/api/v1/books/:id`
- **Create Book**: `POST http://localhost:3000/api/v1/books`
- **Update Book**: `PUT http://localhost:3000/api/v1/books/:id`
- **Delete Book**: `DELETE http://localhost:3000/api/v1/books/:id`

### Categories
- **List Categories**: `GET http://localhost:3000/api/v1/categories`
- **Get Category**: `GET http://localhost:3000/api/v1/categories/:id`

### Authentication
- **Register**: `POST http://localhost:3000/api/v1/auth/register`
- **Login**: `POST http://localhost:3000/api/v1/auth/login`
- **Logout**: `POST http://localhost:3000/api/v1/auth/logout`
- **Refresh Token**: `POST http://localhost:3000/api/v1/auth/refresh`

## 🧪 Testing the API

### Quick Test
```bash
npm run api:test
```

### Manual Testing with curl

**Test Server Health:**
```bash
curl http://localhost:3000/health
```

**Test API Health:**
```bash
curl http://localhost:3000/api/v1/health
```

**Test Books Endpoint:**
```bash
curl http://localhost:3000/api/v1/books
```

**Test Categories Endpoint:**
```bash
curl http://localhost:3000/api/v1/categories
```

### Testing with Browser
Simply open these URLs in your browser:
- http://localhost:3000/health
- http://localhost:3000/api/v1/health
- http://localhost:3000/api/v1/books
- http://localhost:3000/api/v1/categories

## 📝 Current Implementation Status

### ✅ Implemented
- Express server setup
- Database connection (PostgreSQL)
- Basic routing structure
- CORS configuration
- Security middleware (Helmet)
- Rate limiting
- Error handling
- Health check endpoints
- Placeholder book and category endpoints

### 🚧 To Be Implemented
The following endpoints return placeholder responses and need full implementation:
- Authentication endpoints (register, login, logout, refresh)
- Full CRUD operations for books
- Full CRUD operations for categories
- Cart management
- Wishlist management
- Order processing
- Payment integration
- Review system
- User profile management
- Address management
- Coupon system
- Gift points system
- Shipment tracking

## 🔧 Useful Commands

```bash
# Start development server
npm run dev

# Test database connection
npm run db:test

# Reset database (drops all tables)
npm run db:reset

# Test API endpoints
npm run api:test

# Start production server
npm start
```

## 📚 API Documentation

Full API documentation is available in the OpenAPI specification:
- **File**: `book-worm/openapi.yaml`
- **Format**: OpenAPI 3.0
- **Endpoints**: 40+ endpoints across 12 categories

You can view this specification using:
- Swagger Editor: https://editor.swagger.io/
- Postman: Import the YAML file
- VS Code: Install OpenAPI extension

## 🌐 Frontend Integration

The Angular frontend should connect to:
```typescript
const API_BASE_URL = 'http://localhost:3000/api/v1';
```

CORS is configured to allow requests from:
- `http://localhost:4200` (Angular dev server)

## 🐛 Troubleshooting

### Getting 404 errors?
1. Ensure backend server is running: `npm run dev`
2. Check you're using the correct URL: `http://localhost:3000/api/v1/...`
3. Run API test: `npm run api:test`

### Database connection issues?
1. Test connection: `npm run db:test`
2. Check `.env` file has correct credentials
3. Ensure PostgreSQL is running
4. See `TROUBLESHOOTING.md` for detailed help

### Server not starting?
1. Check if port 3000 is already in use
2. Check database connection
3. Verify all dependencies installed: `npm install`
4. Check Node.js version: `node --version` (should be >= 18.0.0)

## 📞 Support

For detailed troubleshooting, see:
- `TROUBLESHOOTING.md` - Database and connection issues
- `README.md` - General setup and configuration
- `openapi.yaml` - Complete API specification

## 🎉 Next Steps

1. ✅ Server is running
2. ✅ Database is connected
3. ✅ Basic endpoints are working
4. 🚧 Implement full controller logic for all endpoints
5. 🚧 Add authentication middleware
6. 🚧 Add validation middleware
7. 🚧 Create seed data for testing
8. 🚧 Write unit tests
9. 🚧 Connect frontend to backend