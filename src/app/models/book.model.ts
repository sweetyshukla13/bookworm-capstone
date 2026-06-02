export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  coverImage: string;
  description: string;
  category: string;
  format: 'Paperback' | 'Hardcover' | 'eBook';
  language?: string;
  rating: number;
  reviewCount: number;
  deliveryDate: string;
  publisher?: string;
  tags?: string[];
  isbn?: string;
}

export interface Author {
  name: string;
  bio: string;
  image: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface OrderSummary {
  subtotal: number;
  tax: number;
  deliveryCharges: number;
  discount: number;
  total: number;
}

// Made with Bob
