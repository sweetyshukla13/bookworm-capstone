const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const BookCategory = sequelize.define('BookCategory', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    bookId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'books',
        key: 'id'
      }
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      }
    }
  }, {
    tableName: 'book_categories',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['book_id', 'category_id']
      }
    ]
  });

  return BookCategory;
};

// Made with Bob