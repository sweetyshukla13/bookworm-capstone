const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Wishlist = sequelize.define('Wishlist', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    bookId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'books',
        key: 'id'
      }
    }
  }, {
    tableName: 'wishlist',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'book_id']
      }
    ]
  });

  return Wishlist;
};

// Made with Bob