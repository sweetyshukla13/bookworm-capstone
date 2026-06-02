require('dotenv').config();
const sequelize = require('./config/database');
const Coupon = require('./models/Coupon');

async function testDatabase() {
  try {
    console.log('Testing database connection...\n');

    // Test connection
    await sequelize.authenticate();
    console.log('✓ Database connection successful');
    console.log(`  Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`  Database: ${process.env.DB_NAME || 'bookworm'}`);
    console.log(`  User: ${process.env.DB_USER || 'postgres'}\n`);

    // Check if coupons table exists and has data
    try {
      const couponCount = await Coupon.count();
      console.log('✓ Coupons table exists');
      console.log(`  Total coupons: ${couponCount}\n`);

      if (couponCount > 0) {
        console.log('Sample coupons:');
        const sampleCoupons = await Coupon.findAll({
          limit: 3,
          attributes: ['code', 'description', 'discountType', 'discountValue', 'isActive']
        });
        
        sampleCoupons.forEach(coupon => {
          console.log(`  - ${coupon.code}: ${coupon.description}`);
          console.log(`    Type: ${coupon.discountType}, Value: ${coupon.discountValue}, Active: ${coupon.isActive}`);
        });
      } else {
        console.log('⚠ No coupons found. Run "npm run seed" to add sample coupons.');
      }
    } catch (error) {
      console.log('✗ Coupons table does not exist');
      console.log('  Run "npm run migrate" to create the table\n');
    }

    console.log('\n✓ Database test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Database test failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Ensure PostgreSQL is running');
    console.error('2. Check your .env file configuration');
    console.error('3. Verify the database exists: CREATE DATABASE bookworm;');
    console.error('4. Check database credentials\n');
    process.exit(1);
  }
}

testDatabase();

// Made with Bob
