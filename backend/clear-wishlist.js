const { Wishlist, sequelize } = require('./src/models');

async function clearWishlist() {
  try {
    console.log('Clearing all wishlist items...\n');
    
    const deleted = await Wishlist.destroy({
      where: {},
      truncate: true
    });

    console.log(`✓ Cleared ${deleted} wishlist items`);
    console.log('✓ Wishlist table is now empty\n');
    console.log('You can now test adding books to wishlist with a clean slate.');

    await sequelize.close();
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    process.exit(1);
  }
}

clearWishlist();

// Made with Bob
