require('dotenv').config();
const sequelize = require('../config/database');
const createCouponsTable = require('./create-coupons-table');

async function runMigrations() {
  try {
    console.log('Starting database migrations...\n');

    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully\n');

    // Run migrations
    console.log('Running migrations:');
    await createCouponsTable.up();

    console.log('\n✓ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();

// Made with Bob
