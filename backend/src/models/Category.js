const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      defaultValue: DataTypes.INTEGER,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
  type: DataTypes.DATE,
  allowNull: false,
  defaultValue: DataTypes.NOW
}
  }, {
    tableName: 'categories',
    timestamps: false,
    underscored: true
  });

  return Category;
};

// Made with Bob
