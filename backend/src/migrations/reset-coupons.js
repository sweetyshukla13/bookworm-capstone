require('dotenv').config();
const sequelize = require('../config/database');
const createCouponsTable = require('./create-coupons-table');

async function resetCouponsTable() {
  try {
    console.log('Resetting coupons table...\n');

    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully\n');

    // Drop the table if it exists
    console.log('Dropping existing coupons table...');
    await createCouponsTable.down();

    // Recreate the table
    console.log('Creating coupons table...');
    await createCouponsTable.up();

    console.log('\n✓ Coupons table reset successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Reset failed:', error);
    process.exit(1);
  }
}

resetCouponsTable();

// Made with Bob
