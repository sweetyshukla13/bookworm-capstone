const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Book = sequelize.define('Book', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    originalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    coverImage: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    format: {
      type: DataTypes.ENUM('Paperback', 'Hardcover', 'eBook', 'Audiobook'),
      allowNull: false
    },
    language: {
      type: DataTypes.STRING,
      defaultValue: 'English'
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5
      }
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    pages: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    publisher: {
      type: DataTypes.STRING,
      allowNull: true
    },
    publishDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    inStock: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    stockQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isBestseller: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isNewLaunch: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isTrending: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'books',
    timestamps: false,
    underscored: true
  });

  return Book;
};

// Made with Bob
