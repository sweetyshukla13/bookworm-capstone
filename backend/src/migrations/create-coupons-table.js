const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

async function up() {
  const queryInterface = sequelize.getQueryInterface();
  
  await queryInterface.createTable('coupons', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    discount_type: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      allowNull: false
    },
    discount_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    min_order_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0
    },
    max_discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    usage_limit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    usage_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  });

  // Create indexes
  await queryInterface.addIndex('coupons', ['code'], {
    unique: true,
    name: 'coupons_code_unique'
  });
  
  await queryInterface.addIndex('coupons', ['is_active'], {
    name: 'coupons_is_active_index'
  });
  
  await queryInterface.addIndex('coupons', ['expiry_date'], {
    name: 'coupons_expiry_date_index'
  });

  console.log('✓ Coupons table created successfully');
}

async function down() {
  const queryInterface = sequelize.getQueryInterface();
  await queryInterface.dropTable('coupons');
  console.log('✓ Coupons table dropped successfully');
}

module.exports = { up, down };

// Made with Bob
