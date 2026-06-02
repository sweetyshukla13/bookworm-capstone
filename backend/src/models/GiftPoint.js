const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const GiftPoint = sequelize.define('GiftPoint', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    totalEarned: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalRedeemed: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'gift_points',
    timestamps: true,
    underscored: true
  });

  return GiftPoint;
};

// Made with Bob