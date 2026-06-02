const { Wishlist, Book, User, sequelize } = require('./src/models');

async function checkWishlist() {
  try {
    console.log('Checking wishlist data...\n');
    
    // Get all wishlist items with user and book details
    const items = await Wishlist.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'name']
        },
        {
          model: Book,
          as: 'book',
          attributes: ['id', 'title', 'author']
        }
      ]
    });

    console.log(`Total wishlist items in database: ${items.length}\n`);
    
    if (items.length === 0) {
      console.log('No wishlist items found in database.');
    } else {
      items.forEach((item, index) => {
        console.log(`${index + 1}. User: ${item.user?.email || 'Unknown'}`);
        console.log(`   Book: ${item.book?.title || 'Unknown'}`);
        console.log(`   Added: ${item.createdAt}`);
        console.log('');
      });
    }

    await sequelize.close();
  } catch (error) {
    console.error('Error checking wishlist:', error);
    process.exit(1);
  }
}

checkWishlist();

// Made with Bob
