import { Injectable, signal } from '@angular/core';
import { Book, CartItem, OrderSummary } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private cartItems = signal<CartItem[]>([]);
  
  readonly cart = this.cartItems.asReadonly();

  private mockBooks: Book[] = [
    {
      id: '1',
      title: 'The Art of Focus',
      author: 'Arjun Patel',
      price: 399,
      coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
      description: 'A practical guide to mastering focus & boosting productivity every day.',
      category: 'Self-help',
      format: 'Paperback',
      rating: 4.5,
      reviewCount: 234,
      deliveryDate: 'Mon, 23 Jul',
      tags: ['Non-fiction', 'Self Help']
    },
    {
      id: '2',
      title: 'The Art of Learning',
      author: 'Raj Patel',
      price: 259,
      coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
      description: 'Master the mindset and methods for effective lifelong learning.',
      category: 'Self-help',
      format: 'Paperback',
      rating: 4.8,
      reviewCount: 456,
      deliveryDate: 'Mon, 23 Jul',
      tags: ['Non-fiction', 'Self Help']
    },
    {
      id: '3',
      title: 'The Path to Success',
      author: 'James Wright',
      price: 359,
      coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop',
      description: 'A practical guide to achieving goals with clarity and confidence.',
      category: 'Self-help',
      format: 'Paperback',
      rating: 4.6,
      reviewCount: 189,
      deliveryDate: 'Mon, 23 Jul',
      tags: ['Non-fiction', 'Self Help']
    },
    {
      id: '4',
      title: 'The Midnight Hour',
      author: 'James Adams',
      price: 299,
      coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
      description: 'Haunting tale of a man\'s journey & the shadows of a forgotten past.',
      category: 'Mystery',
      format: 'Paperback',
      rating: 4.7,
      reviewCount: 567,
      deliveryDate: 'Mon, 23 Jul',
      tags: ['Fiction', 'Thriller', 'Horror']
    },
    {
      id: '5',
      title: 'Beneath the Stars',
      author: 'Jessica Martin',
      price: 499,
      coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
      description: 'A heartwarming tale, where two souls discover who you need.',
      category: 'Romance',
      format: 'Hardcover',
      rating: 4.9,
      reviewCount: 892,
      deliveryDate: 'Mon, 23 Jul',
      tags: ['Fiction', 'Love', 'Drama']
    },
    {
      id: '6',
      title: 'The Final Frontier',
      author: 'Laura Mitchell',
      price: 359,
      coverImage: 'https://images.unsplash.com/photo-1614544048536-0d28caf77f41?w=400&h=600&fit=crop',
      description: 'A mission to space secrets to the humanity forever.',
      category: 'Science Fiction',
      format: 'Paperback',
      rating: 4.4,
      reviewCount: 321,
      deliveryDate: 'Mon, 23 Jul',
      tags: ['Fiction', 'Sci-Fi']
    },
    {
      id: '7',
      title: 'Joy of Minimalism',
      author: 'Daniel Reed',
      price: 149,
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop',
      description: 'Declutter your life to uncover peace, clarity, and joy.',
      category: 'Self-help',
      format: 'Paperback',
      rating: 4.3,
      reviewCount: 178,
      deliveryDate: 'Mon, 23 Jul',
      tags: ['Non-fiction', 'Self Help']
    },
    {
      id: '8',
      title: 'The Vanishing House',
      author: 'Clara Nelson',
      price: 99,
      coverImage: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop',
      description: 'An eerie mystery unfolds within a house that disappears.',
      category: 'Mystery',
      format: 'eBook',
      rating: 4.2,
      reviewCount: 234,
      deliveryDate: 'Mon, 23 Jul',
      tags: ['Fiction', 'Mystery']
    },
    {
      id: '9',
      title: 'The Lost Kitten',
      author: 'Emily Parker',
      price: 339,
      coverImage: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&h=600&fit=crop',
      description: 'A heartwarming tale of courage, friendship, and feline adventure.',
      category: 'Children\'s',
      format: 'Hardcover',
      rating: 4.8,
      reviewCount: 445,
      deliveryDate: 'Mon, 23 Jul',
      tags: ['Fiction', 'Children']
    }
  ];

  getBooks(): Book[] {
    return this.mockBooks;
  }

  getBookById(id: string): Book | undefined {
    return this.mockBooks.find(book => book.id === id);
  }

  getBooksByCategory(category: string): Book[] {
    if (category === 'All') return this.mockBooks;
    return this.mockBooks.filter(book => book.category === category);
  }

  getRelatedBooks(bookId: string, limit: number = 3): Book[] {
    const book = this.getBookById(bookId);
    if (!book) return [];
    
    return this.mockBooks
      .filter(b => b.id !== bookId && b.category === book.category)
      .slice(0, limit);
  }

  addToCart(book: Book): void {
    const currentCart = this.cartItems();
    const existingItem = currentCart.find(item => item.book.id === book.id);
    
    if (existingItem) {
      this.cartItems.set(
        currentCart.map(item =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      this.cartItems.set([...currentCart, { book, quantity: 1 }]);
    }
  }

  removeFromCart(bookId: string): void {
    this.cartItems.set(
      this.cartItems().filter(item => item.book.id !== bookId)
    );
  }

  updateQuantity(bookId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(bookId);
      return;
    }
    
    this.cartItems.set(
      this.cartItems().map(item =>
        item.book.id === bookId ? { ...item, quantity } : item
      )
    );
  }

  getCartCount(): number {
    return this.cartItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  calculateOrderSummary(): OrderSummary {
    const subtotal = this.cartItems().reduce(
      (sum, item) => sum + item.book.price * item.quantity,
      0
    );
    const tax = Math.round(subtotal * 0.05);
    const deliveryCharges = subtotal > 500 ? 0 : 50;
    const discount = 100;
    const total = subtotal + tax + deliveryCharges - discount;

    return { subtotal, tax, deliveryCharges, discount, total };
  }

  clearCart(): void {
    this.cartItems.set([]);
  }
}

// Made with Bob
