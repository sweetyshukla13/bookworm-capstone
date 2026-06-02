const sequelize = require('../config/database');

// Import models
const User = require('./User')(sequelize);
const Category = require('./Category')(sequelize);
const Book = require('./Book')(sequelize);
const Address = require('./Address')(sequelize);
const Cart = require('./Cart')(sequelize);
const CartItem = require('./CartItem')(sequelize);
const Order = require('./Order')(sequelize);
const OrderItem = require('./OrderItem')(sequelize);
const Payment = require('./Payment')(sequelize);
const Review = require('./Review')(sequelize);
const Shipment = require('./Shipment')(sequelize);
const Wishlist = require('./Wishlist')(sequelize);
const Coupon = require('./Coupon'); // Already initialized
const GiftPoint = require('./GiftPoint')(sequelize);
const BookCategory = require('./BookCategory')(sequelize);

// Define associations

// User associations
User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' });
User.hasOne(Cart, { foreignKey: 'userId', as: 'cart' });
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
User.hasMany(Wishlist, { foreignKey: 'userId', as: 'wishlist' });
User.hasOne(GiftPoint, { foreignKey: 'userId', as: 'giftPoints' });

// Category associations
Category.hasMany(Book, { foreignKey: 'categoryId', as: 'books' });

// Book associations
Book.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Book.hasMany(CartItem, { foreignKey: 'bookId', as: 'cartItems' });
Book.hasMany(OrderItem, { foreignKey: 'bookId', as: 'orderItems' });
Book.hasMany(Review, { foreignKey: 'bookId', as: 'reviews' });
Book.hasMany(Wishlist, { foreignKey: 'bookId', as: 'wishlists' });
Book.hasMany(BookCategory, { foreignKey: 'bookId', as: 'bookCategories' });

// Address associations
Address.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Address.hasMany(Order, { foreignKey: 'shippingAddressId', as: 'orders' });

// Cart associations
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' });

// CartItem associations
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });
CartItem.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

// Order associations
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Order.belongsTo(Address, { foreignKey: 'shippingAddressId', as: 'shippingAddress' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
Order.hasOne(Payment, { foreignKey: 'orderId', as: 'payment' });
Order.hasOne(Shipment, { foreignKey: 'orderId', as: 'shipment' });

// OrderItem associations
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
OrderItem.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

// Payment associations
Payment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Review associations
Review.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Shipment associations
Shipment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Wishlist associations
Wishlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Wishlist.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

// GiftPoint associations
GiftPoint.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// BookCategory associations
BookCategory.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });
BookCategory.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

module.exports = {
  sequelize,
  User,
  Category,
  Book,
  Address,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Payment,
  Review,
  Shipment,
  Wishlist,
  Coupon,
  GiftPoint,
  BookCategory
};

// Made with Bob
