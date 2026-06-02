# Database Connection Troubleshooting Guide

## Problem: "Unable to connect to database"

The database connection is working fine, but the existing tables have an old schema that conflicts with the new model definitions.

### ✅ Diagnosis Complete

Running `npm run db:test` shows:
- ✅ Database connection: **SUCCESSFUL**
- ✅ PostgreSQL version: 16.14
- ✅ Database name: `bookworm`
- ✅ Existing tables: 16 tables found

### 🔍 Root Cause

The existing tables were created with an old schema. When Sequelize tries to sync with `alter: true`, it encounters conflicts because:
1. The `users` table has null password values
2. New model requires password to be NOT NULL
3. Schema migration fails

### 🛠️ Solution

**Option 1: Reset Database (Recommended for Development)**

```bash
cd book-worm/backend
npm run db:reset
npm run dev
```

This will:
1. Drop all existing tables
2. Let Sequelize create fresh tables with correct schema
3. Start the server

**Option 2: Manual SQL Reset**

Connect to PostgreSQL and run:
```sql
-- Connect to postgres database first
\c postgres

-- Drop and recreate the database
DROP DATABASE IF EXISTS bookworm;
CREATE DATABASE bookworm;

-- Connect to the new database
\c bookworm
```

Then start the server:
```bash
npm run dev
```

**Option 3: Keep Data (Advanced)**

If you need to preserve existing data:

```sql
-- Backup existing data
pg_dump bookworm > backup.sql

-- Reset database
DROP DATABASE bookworm;
CREATE DATABASE bookworm;

-- Start server to create new schema
-- Then manually migrate data from backup
```

## Quick Commands

```bash
# Test database connection
npm run db:test

# Reset database (drops all tables)
npm run db:reset

# Start development server
npm run dev

# Start production server
npm start
```

## Common Issues

### Issue 1: PostgreSQL not running
**Error**: `ECONNREFUSED`
**Solution**: Start PostgreSQL service
```bash
# Windows
net start postgresql-x64-16

# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### Issue 2: Wrong database name
**Error**: `database "bookworm_db" does not exist`
**Solution**: Check `.env` file - database name is `bookworm` not `bookworm_db`

### Issue 3: Wrong password
**Error**: `password authentication failed`
**Solution**: Update `DB_PASSWORD` in `.env` file

### Issue 4: Port already in use
**Error**: `Port 3000 is already in use`
**Solution**: 
- Kill the process using port 3000
- Or change `PORT` in `.env` file

## Environment Variables

Ensure your `.env` file has correct values:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookworm
DB_USER=postgres
DB_PASSWORD=postgres
```

## Next Steps After Reset

1. ✅ Database reset complete
2. ✅ Start server: `npm run dev`
3. ✅ Server should start on http://localhost:3000
4. ✅ All tables will be created automatically
5. ✅ Test API endpoints using the OpenAPI spec

## API Documentation

Once the server is running, you can:
- View OpenAPI spec: `book-worm/openapi.yaml`
- Test endpoints with Postman or curl
- Frontend connects to: `http://localhost:3000/api/v1`

## Support

If issues persist:
1. Check PostgreSQL logs
2. Check server logs in terminal
3. Verify all dependencies installed: `npm install`
4. Ensure Node.js version >= 18.0.0