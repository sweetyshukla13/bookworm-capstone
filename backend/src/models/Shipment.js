const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Shipment = sequelize.define('Shipment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    trackingNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    carrier: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_transit', 'delivered', 'returned'),
      defaultValue: 'pending'
    },
    shippedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    estimatedDelivery: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'shipments',
    timestamps: true,
    underscored: true
  });

  return Shipment;
};

// Made with Bob