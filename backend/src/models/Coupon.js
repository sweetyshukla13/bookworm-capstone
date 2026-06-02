const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isUppercase: true
    }
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  discountType: {
    type: DataTypes.ENUM('percentage', 'fixed'),
    allowNull: false,
    field: 'discount_type'
  },
  discountValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'discount_value',
    validate: {
      min: 0
    }
  },
  minOrderAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'min_order_amount',
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  maxDiscountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'max_discount_amount',
    validate: {
      min: 0
    }
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'expiry_date'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'usage_limit',
    validate: {
      min: 0
    }
  },
  usageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'usage_count',
    validate: {
      min: 0
    }
  }
}, {
  tableName: 'coupons',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['code']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['expiry_date']
    }
  ]
});

module.exports = Coupon;

// Made with Bob
