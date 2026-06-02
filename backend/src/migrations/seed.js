require('dotenv').config();
const sequelize = require('../config/database');
const Coupon = require('../models/Coupon');

async function seedCoupons() {
  try {
    console.log('Starting database seeding...\n');

    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully\n');

    // Sample coupons data
    const coupons = [
      {
        code: 'WELCOME10',
        description: 'Welcome offer - Get 10% off on your first order',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 299,
        maxDiscountAmount: 100,
        expiryDate: new Date('2026-12-31'),
        isActive: true,
        usageLimit: 1000,
        usageCount: 0
      },
      {
        code: 'SAVE20',
        description: 'Save 20% on orders above ₹500',
        discountType: 'percentage',
        discountValue: 20,
        minOrderAmount: 500,
        maxDiscountAmount: 200,
        expiryDate: new Date('2026-12-31'),
        isActive: true,
        usageLimit: 500,
        usageCount: 0
      },
      {
        code: 'FLAT50',
        description: 'Flat ₹50 off on all orders',
        discountType: 'fixed',
        discountValue: 50,
        minOrderAmount: 200,
        maxDiscountAmount: null,
        expiryDate: new Date('2026-12-31'),
        isActive: true,
        usageLimit: null,
        usageCount: 0
      },
      {
        code: 'MEGA30',
        description: 'Mega sale - 30% off on orders above ₹1000',
        discountType: 'percentage',
        discountValue: 30,
        minOrderAmount: 1000,
        maxDiscountAmount: 500,
        expiryDate: new Date('2026-12-31'),
        isActive: true,
        usageLimit: 200,
        usageCount: 0
      },
      {
        code: 'FLAT100',
        description: 'Flat ₹100 off on orders above ₹800',
        discountType: 'fixed',
        discountValue: 100,
        minOrderAmount: 800,
        maxDiscountAmount: null,
        expiryDate: new Date('2026-12-31'),
        isActive: true,
        usageLimit: 300,
        usageCount: 0
      },
      {
        code: 'BOOKWORM15',
        description: 'Bookworm special - 15% off',
        discountType: 'percentage',
        discountValue: 15,
        minOrderAmount: 400,
        maxDiscountAmount: 150,
        expiryDate: new Date('2026-12-31'),
        isActive: true,
        usageLimit: null,
        usageCount: 0
      }
    ];

    console.log('Seeding coupons...');
    
    // Clear existing coupons (optional - comment out if you want to keep existing data)
    await Coupon.destroy({ where: {} });
    console.log('✓ Cleared existing coupons');

    // Insert new coupons
    for (const couponData of coupons) {
      await Coupon.create(couponData);
      console.log(`✓ Created coupon: ${couponData.code}`);
    }

    console.log(`\n✓ Successfully seeded ${coupons.length} coupons!`);
    console.log('\nAvailable Coupons:');
    console.log('==================');
    coupons.forEach(c => {
      console.log(`${c.code} - ${c.description}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('✗ Seeding failed:', error);
    process.exit(1);
  }
}

seedCoupons();

// Made with Bob
