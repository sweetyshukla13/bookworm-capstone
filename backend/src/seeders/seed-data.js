const { sequelize, User, Category, Book, Address, Cart, CartItem, Order, OrderItem, Payment, Review, Shipment, Wishlist, Coupon, GiftPoint, BookCategory } = require('../models');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data (optional - comment out if you want to keep existing data)
    await sequelize.sync({ force: true });
    console.log('✅ Database tables reset');

    // 1. Create Users
    console.log('Creating users...');
    const users = await User.bulkCreate([
      {
        email: 'john.doe@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'John Doe',
        phone: '+91-9876543210',
        isActive: true
      },
      {
        email: 'jane.smith@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Jane Smith',
        phone: '+91-9876543211',
        isActive: true
      },
      {
        email: 'bob.wilson@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Bob Wilson',
        phone: '+91-9876543212',
        isActive: true
      },
      {
        email: 'alice.brown@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Alice Brown',
        phone: '+91-9876543213',
        isActive: true
      }
    ]);
    console.log(`✅ Created ${users.length} users`);

    // 2. Create Categories
    console.log('Creating categories...');
    const categories = await Category.bulkCreate([
      { name: 'Fiction', description: 'Fictional stories and novels' },
      { name: 'Non-Fiction', description: 'Real-life stories and facts' },
      { name: 'Science Fiction', description: 'Futuristic and scientific fiction' },
      { name: 'Mystery', description: 'Mystery and thriller books' },
      { name: 'Romance', description: 'Romantic novels' },
      { name: 'Biography', description: 'Life stories of famous people' },
      { name: 'Self-Help', description: 'Personal development books' },
      { name: 'Technology', description: 'Books about technology and programming' },
      { name: 'History', description: 'Historical books and events' },
      { name: 'Children', description: 'Books for children' }
    ]);
    console.log(`✅ Created ${categories.length} categories`);

    // 3. Create Books
    console.log('Creating books...');
    const books = await Book.bulkCreate([
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '9780743273565',
        description: 'A classic American novel set in the Jazz Age',
        price: 299.00,
        originalPrice: 349.00,
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        categoryId: categories[0].id,
        publisher: 'Scribner',
        publishDate: new Date('1925-04-10'),
        pages: 180,
        language: 'English',
        format: 'Paperback',
        stockQuantity: 50
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '9780061120084',
        description: 'A gripping tale of racial injustice and childhood innocence',
        price: 350.00,
        originalPrice: 350.00,
        coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
        categoryId: categories[0].id,
        publisher: 'Harper Perennial',
        publishDate: new Date('1960-07-11'),
        pages: 324,
        language: 'English',
        format: 'Paperback',
        stockQuantity: 45
      },
      {
        title: '1984',
        author: 'George Orwell',
        isbn: '9780451524935',
        description: 'A dystopian social science fiction novel',
        price: 399.00,
        originalPrice: 399.00,
        coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
        categoryId: categories[2].id,
        publisher: 'Signet Classic',
        publishDate: new Date('1949-06-08'),
        pages: 328,
        language: 'English',
        format: 'Paperback',
        stockQuantity: 60
      },
      {
        title: 'The Da Vinci Code',
        author: 'Dan Brown',
        isbn: '9780307474278',
        description: 'A mystery thriller novel',
        price: 450.00,
        originalPrice: 450.00,
        coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
        categoryId: categories[3].id,
        publisher: 'Anchor Books',
        publishDate: new Date('2003-03-18'),
        pages: 454,
        language: 'English',
        format: 'Hardcover',
        stockQuantity: 40
      },
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        isbn: '9780141439518',
        description: 'A romantic novel of manners',
        price: 299.00,
        originalPrice: 299.00,
        coverImage: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400',
        categoryId: categories[4].id,
        publisher: 'Penguin Classics',
        publishDate: new Date('1813-01-28'),
        pages: 432,
        language: 'English',
        format: 'Paperback',
        stockQuantity: 55
      },
      {
        title: 'Steve Jobs',
        author: 'Walter Isaacson',
        isbn: '9781451648539',
        description: 'The exclusive biography of Steve Jobs',
        price: 599.00,
        originalPrice: 599.00,
        coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
        categoryId: categories[5].id,
        publisher: 'Simon & Schuster',
        publishDate: new Date('2011-10-24'),
        pages: 656,
        language: 'English',
        format: 'Hardcover',
        stockQuantity: 30
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        isbn: '9780735211292',
        description: 'An easy and proven way to build good habits',
        price: 499.00,
        originalPrice: 499.00,
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
        categoryId: categories[6].id,
        publisher: 'Avery',
        publishDate: new Date('2018-10-16'),
        pages: 320,
        language: 'English',
        format: 'Hardcover',
        stockQuantity: 70
      },
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '9780132350884',
        description: 'A handbook of agile software craftsmanship',
        price: 799.00,
        originalPrice: 799.00,
        coverImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400',
        categoryId: categories[7].id,
        publisher: 'Prentice Hall',
        publishDate: new Date('2008-08-01'),
        pages: 464,
        language: 'English',
        format: 'Paperback',
        stockQuantity: 35
      },
      {
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        isbn: '9780062316097',
        description: 'A brief history of humankind',
        price: 550.00,
        originalPrice: 550.00,
        coverImage: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400',
        categoryId: categories[8].id,
        publisher: 'Harper',
        publishDate: new Date('2015-02-10'),
        pages: 443,
        language: 'English',
        format: 'Paperback',
        stockQuantity: 50
      },
      {
        title: 'Harry Potter and the Philosopher\'s Stone',
        author: 'J.K. Rowling',
        isbn: '9780439708180',
        description: 'The first book in the Harry Potter series',
        price: 399.00,
        originalPrice: 399.00,
        coverImage: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400',
        categoryId: categories[9].id,
        publisher: 'Scholastic',
        publishDate: new Date('1997-06-26'),
        pages: 309,
        language: 'English',
        format: 'Paperback',
        stockQuantity: 80
      },
      {
        title: 'The Art of Focus',
        author: 'Arjun Patel',
        isbn: '9780143455001',
        description: 'Practical guide to mastering focus & boosting productivity every day.',
        price: 399.00,
        originalPrice: 399.00,
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        categoryId: categories[6].id,
        publisher: 'Non-fiction',
        publishDate: new Date('2024-03-23'),
        pages: 250,
        language: 'English',
        format: 'Paperback',
        stockQuantity: 45
      },
      {
        title: 'The Art of Learning',
        author: 'Raj Patel',
        isbn: '9780143455002',
        description: 'Master the mindset and methods for efficient and joyful learning.',
        price: 259.00,
        originalPrice: 259.00,
        coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
        categoryId: categories[6].id,
        publisher: 'Non-fiction',
        publishDate: new Date('2024-03-23'),
        pages: 280,
        language: 'English',
        format: 'Paperback',
        stockQuantity: 50
      },
      {
        title: 'The Path to Success',
        author: 'Tom Wright',
        isbn: '9780143455003',
        description: 'A practical guide to achieving goals and unlocking your potential.',
        price: 359.00,
        originalPrice: 359.00,
        coverImage: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400',
        categoryId: categories[6].id,
        publisher: 'Non-fiction',
        publishDate: new Date('2024-03-23'),
        pages: 320,
        language: 'English',
        format: 'Paperback',
        stockQuantity: 40,
        isBestseller: false
      },
      {
        title: 'The Midnight Hour',
        author: 'James Adams',
        isbn: '9780143455004',
        description: 'Haunting tale of a man\'s journey & the shadows of a forgotten past.',
        price: 299.00,
        originalPrice: 299.00,
        coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
        categoryId: categories[3].id,
        publisher: 'Fiction',
        publishDate: new Date('2024-03-23'),
        pages: 350,
        language: 'English',
        format: 'Paperback',
        stockQuantity: 55,
        isBestseller: true
      },
      {
        title: 'Beneath the Stars',
        author: 'Jessica Martin',
        isbn: '9780143455005',
        description: 'A heartwarming tale, when two souls discover what they need.',
        price: 499.00,
        originalPrice: 499.00,
        coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
        categoryId: categories[4].id,
        publisher: 'Fiction',
        publishDate: new Date('2024-03-23'),
        pages: 380,
        language: 'English',
        format: 'Hardcover',
        stockQuantity: 35,
        isBestseller: true
      },
      {
        title: 'The Final Frontier',
        author: 'Laura Mitchell',
        isbn: '9780143455006',
        description: 'A thrilling quest to change humanity forever.',
        price: 359.00,
        originalPrice: 359.00,
        coverImage: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400',
        categoryId: categories[2].id,
        publisher: 'Fiction',
        publishDate: new Date('2024-03-23'),
        pages: 420,
        language: 'English',
        format: 'Paperback',
        stockQuantity: 48,
        isBestseller: true
      },
      {
        title: 'Joy of Minimalism',
        author: 'Daniel Reed',
        isbn: '9780143455007',
        description: 'Declutter your life to uncover peace, clarity, and joy.',
        price: 149.00,
        originalPrice: 149.00,
        coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
        categoryId: categories[6].id,
        publisher: 'Non-fiction',
        publishDate: new Date('2024-03-23'),
        pages: 200,
        language: 'English',
        format: 'Paperback',
        stockQuantity: 60,
        isNewLaunch: true
      },
      {
        title: 'The Vanishing House',
        author: 'Clara Nelson',
        isbn: '9780143455008',
        description: 'A chilling mystery unfolds within a house that disappears.',
        price: 99.00,
        originalPrice: 99.00,
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
        categoryId: categories[3].id,
        publisher: 'Fiction',
        publishDate: new Date('2024-03-23'),
        pages: 290,
        language: 'English',
        format: 'eBook',
        stockQuantity: 100,
        isNewLaunch: true
      },
      {
        title: 'The Lost Kitten',
        author: 'Emily Parker',
        isbn: '9780143455009',
        description: 'A heartwarming tale of courage, friendship, and feline adventure.',
        price: 339.00,
        originalPrice: 339.00,
        coverImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400',
        categoryId: categories[9].id,
        publisher: 'Fiction',
        publishDate: new Date('2024-03-23'),
        pages: 180,
        language: 'English',
        format: 'Hardcover',
        stockQuantity: 70,
        isNewLaunch: true
      }
    ]);
    console.log(`✅ Created ${books.length} books`);

    // 4. Create Addresses
    console.log('Creating addresses...');
    const addresses = await Address.bulkCreate([
      {
        userId: users[0].id,
        fullName: 'John Doe',
        phone: '+91-9876543210',
        addressLine1: '123 Main Street',
        addressLine2: 'Apartment 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
        isDefault: true
      },
      {
        userId: users[0].id,
        fullName: 'John Doe',
        phone: '+91-9876543210',
        addressLine1: '456 Park Avenue',
        addressLine2: null,
        city: 'Delhi',
        state: 'Delhi',
        postalCode: '110001',
        country: 'India',
        isDefault: false
      },
      {
        userId: users[1].id,
        fullName: 'Jane Smith',
        phone: '+91-9876543211',
        addressLine1: '789 Lake Road',
        addressLine2: 'Villa 12',
        city: 'Bangalore',
        state: 'Karnataka',
        postalCode: '560001',
        country: 'India',
        isDefault: true
      },
      {
        userId: users[2].id,
        fullName: 'Bob Wilson',
        phone: '+91-9876543212',
        addressLine1: '321 Beach Street',
        addressLine2: null,
        city: 'Chennai',
        state: 'Tamil Nadu',
        postalCode: '600001',
        country: 'India',
        isDefault: true
      }
    ]);
    console.log(`✅ Created ${addresses.length} addresses`);

    // 5. Create Carts
    console.log('Creating carts...');
    const carts = await Cart.bulkCreate([
      { userId: users[0].id },
      { userId: users[1].id },
      { userId: users[2].id },
      { userId: users[3].id }
    ]);
    console.log(`✅ Created ${carts.length} carts`);

    // 6. Create Cart Items
    console.log('Creating cart items...');
    const cartItems = await CartItem.bulkCreate([
      {
        cartId: carts[0].id,
        bookId: books[0].id,
        quantity: 2,
        price: books[0].discountPrice
      },
      {
        cartId: carts[0].id,
        bookId: books[2].id,
        quantity: 1,
        price: books[2].discountPrice
      },
      {
        cartId: carts[1].id,
        bookId: books[4].id,
        quantity: 1,
        price: books[4].discountPrice
      },
      {
        cartId: carts[2].id,
        bookId: books[6].id,
        quantity: 3,
        price: books[6].discountPrice
      }
    ]);
    console.log(`✅ Created ${cartItems.length} cart items`);

    // 7. Create Orders
    console.log('Creating orders...');
    const orders = await Order.bulkCreate([
      {
        userId: users[0].id,
        orderNumber: 'ORD-2024-001',
        status: 'delivered',
        totalAmount: 1047.00,
        shippingAddressId: addresses[0].id,
        paymentMethod: 'credit_card',
        paymentStatus: 'completed',
        notes: 'Please deliver before 5 PM'
      },
      {
        userId: users[1].id,
        orderNumber: 'ORD-2024-002',
        status: 'shipped',
        totalAmount: 748.00,
        shippingAddressId: addresses[2].id,
        paymentMethod: 'upi',
        paymentStatus: 'completed',
        notes: null
      },
      {
        userId: users[2].id,
        orderNumber: 'ORD-2024-003',
        status: 'processing',
        totalAmount: 1347.00,
        shippingAddressId: addresses[3].id,
        paymentMethod: 'debit_card',
        paymentStatus: 'completed',
        notes: 'Gift wrap requested'
      }
    ]);
    console.log(`✅ Created ${orders.length} orders`);

    // 8. Create Order Items
    console.log('Creating order items...');
    const orderItems = await OrderItem.bulkCreate([
      {
        orderId: orders[0].id,
        bookId: books[1].id,
        quantity: 2,
        price: books[1].discountPrice,
        subtotal: books[1].discountPrice * 2
      },
      {
        orderId: orders[0].id,
        bookId: books[3].id,
        quantity: 1,
        price: books[3].discountPrice,
        subtotal: books[3].discountPrice
      },
      {
        orderId: orders[1].id,
        bookId: books[4].id,
        quantity: 3,
        price: books[4].discountPrice,
        subtotal: books[4].discountPrice * 3
      },
      {
        orderId: orders[2].id,
        bookId: books[6].id,
        quantity: 3,
        price: books[6].discountPrice,
        subtotal: books[6].discountPrice * 3
      }
    ]);
    console.log(`✅ Created ${orderItems.length} order items`);

    // 9. Create Payments
    console.log('Creating payments...');
    const payments = await Payment.bulkCreate([
      {
        orderId: orders[0].id,
        amount: 1047.00,
        paymentMethod: 'credit_card',
        transactionId: 'TXN-CC-001',
        status: 'completed',
        paidAt: new Date()
      },
      {
        orderId: orders[1].id,
        amount: 748.00,
        paymentMethod: 'upi',
        transactionId: 'TXN-UPI-002',
        status: 'completed',
        paidAt: new Date()
      },
      {
        orderId: orders[2].id,
        amount: 1347.00,
        paymentMethod: 'debit_card',
        transactionId: 'TXN-DC-003',
        status: 'completed',
        paidAt: new Date()
      }
    ]);
    console.log(`✅ Created ${payments.length} payments`);

    // 10. Create Shipments
    console.log('Creating shipments...');
    const shipments = await Shipment.bulkCreate([
      {
        orderId: orders[0].id,
        trackingNumber: 'TRACK-001',
        carrier: 'Blue Dart',
        status: 'delivered',
        shippedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        orderId: orders[1].id,
        trackingNumber: 'TRACK-002',
        carrier: 'DTDC',
        status: 'in_transit',
        shippedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        deliveredAt: null,
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      },
      {
        orderId: orders[2].id,
        trackingNumber: 'TRACK-003',
        carrier: 'FedEx',
        status: 'pending',
        shippedAt: null,
        deliveredAt: null,
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      }
    ]);
    console.log(`✅ Created ${shipments.length} shipments`);

    // 11. Create Reviews
    console.log('Creating reviews...');
    const reviews = await Review.bulkCreate([
      {
        bookId: books[0].id,
        userId: users[0].id,
        rating: 5,
        title: 'A Timeless Classic',
        comment: 'The Great Gatsby is a masterpiece. Fitzgerald\'s writing is beautiful and the story is captivating.',
        isVerifiedPurchase: true
      },
      {
        bookId: books[1].id,
        userId: users[1].id,
        rating: 5,
        title: 'Must Read',
        comment: 'An important book that everyone should read. Harper Lee\'s storytelling is exceptional.',
        isVerifiedPurchase: true
      },
      {
        bookId: books[2].id,
        userId: users[2].id,
        rating: 4,
        title: 'Thought-Provoking',
        comment: 'A chilling vision of the future. Very relevant even today.',
        isVerifiedPurchase: false
      },
      {
        bookId: books[6].id,
        userId: users[0].id,
        rating: 5,
        title: 'Life Changing',
        comment: 'This book helped me build better habits. Highly recommended!',
        isVerifiedPurchase: true
      },
      {
        bookId: books[7].id,
        userId: users[2].id,
        rating: 5,
        title: 'Essential for Developers',
        comment: 'Every programmer should read this book. It changed how I write code.',
        isVerifiedPurchase: true
      }
    ]);
    console.log(`✅ Created ${reviews.length} reviews`);

    // 12. Create Wishlists
    console.log('Creating wishlists...');
    const wishlists = await Wishlist.bulkCreate([
      { userId: users[0].id, bookId: books[5].id },
      { userId: users[0].id, bookId: books[8].id },
      { userId: users[1].id, bookId: books[7].id },
      { userId: users[2].id, bookId: books[9].id },
      { userId: users[3].id, bookId: books[0].id },
      { userId: users[3].id, bookId: books[3].id }
    ]);
    console.log(`✅ Created ${wishlists.length} wishlist items`);

    // 13. Create Coupons
    console.log('Creating coupons...');
    const coupons = await Coupon.bulkCreate([
      {
        code: 'WELCOME10',
        description: 'Welcome discount for new users',
        discountType: 'percentage',
        discountValue: 10.00,
        minPurchaseAmount: 500.00,
        maxDiscountAmount: 100.00,
        usageLimit: 100,
        usedCount: 15,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        code: 'FLAT50',
        description: 'Flat ₹50 off on orders above ₹300',
        discountType: 'fixed',
        discountValue: 50.00,
        minPurchaseAmount: 300.00,
        maxDiscountAmount: null,
        usageLimit: 500,
        usedCount: 87,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        code: 'SUMMER25',
        description: 'Summer sale - 25% off',
        discountType: 'percentage',
        discountValue: 25.00,
        minPurchaseAmount: 1000.00,
        maxDiscountAmount: 250.00,
        usageLimit: 200,
        usedCount: 45,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        code: 'EXPIRED',
        description: 'Expired coupon',
        discountType: 'percentage',
        discountValue: 20.00,
        minPurchaseAmount: 500.00,
        maxDiscountAmount: 150.00,
        usageLimit: 50,
        usedCount: 50,
        validFrom: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        validUntil: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        isActive: false
      }
    ]);
    console.log(`✅ Created ${coupons.length} coupons`);

    // 14. Create Gift Points
    console.log('Creating gift points...');
    const giftPoints = await GiftPoint.bulkCreate([
      {
        userId: users[0].id,
        points: 250,
        totalEarned: 500,
        totalRedeemed: 250
      },
      {
        userId: users[1].id,
        points: 150,
        totalEarned: 150,
        totalRedeemed: 0
      },
      {
        userId: users[2].id,
        points: 75,
        totalEarned: 200,
        totalRedeemed: 125
      },
      {
        userId: users[3].id,
        points: 0,
        totalEarned: 100,
        totalRedeemed: 100
      }
    ]);
    console.log(`✅ Created ${giftPoints.length} gift point records`);

    // 15. Create Book Categories (many-to-many relationships)
    console.log('Creating book-category relationships...');
    const bookCategories = await BookCategory.bulkCreate([
      { bookId: books[0].id, categoryId: categories[0].id },
      { bookId: books[1].id, categoryId: categories[0].id },
      { bookId: books[2].id, categoryId: categories[2].id },
      { bookId: books[2].id, categoryId: categories[0].id },
      { bookId: books[3].id, categoryId: categories[3].id },
      { bookId: books[4].id, categoryId: categories[4].id },
      { bookId: books[4].id, categoryId: categories[0].id },
      { bookId: books[5].id, categoryId: categories[5].id },
      { bookId: books[6].id, categoryId: categories[6].id },
      { bookId: books[7].id, categoryId: categories[7].id },
      { bookId: books[8].id, categoryId: categories[8].id },
      { bookId: books[8].id, categoryId: categories[1].id },
      { bookId: books[9].id, categoryId: categories[9].id },
      { bookId: books[9].id, categoryId: categories[0].id }
    ]);
    console.log(`✅ Created ${bookCategories.length} book-category relationships`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${users.length} users`);
    console.log(`   - ${categories.length} categories`);
    console.log(`   - ${books.length} books`);
    console.log(`   - ${addresses.length} addresses`);
    console.log(`   - ${carts.length} carts`);
    console.log(`   - ${cartItems.length} cart items`);
    console.log(`   - ${orders.length} orders`);
    console.log(`   - ${orderItems.length} order items`);
    console.log(`   - ${payments.length} payments`);
    console.log(`   - ${shipments.length} shipments`);
    console.log(`   - ${reviews.length} reviews`);
    console.log(`   - ${wishlists.length} wishlist items`);
    console.log(`   - ${coupons.length} coupons`);
    console.log(`   - ${giftPoints.length} gift point records`);
    console.log(`   - ${bookCategories.length} book-category relationships`);
    console.log('\n🔐 Test User Credentials:');
    console.log('   Email: john.doe@example.com | Password: password123');
    console.log('   Email: jane.smith@example.com | Password: password123');
    console.log('   Email: bob.wilson@example.com | Password: password123');
    console.log('   Email: alice.brown@example.com | Password: password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run the seeder
seedDatabase();

// Made with Bob
