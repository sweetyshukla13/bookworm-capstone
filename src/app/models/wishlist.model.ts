import { Book } from './book.model';

export interface WishlistItem {
  id: string;
  userId: string;
  bookId: string;
  book?: Book;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistResponse {
  status: string;
  message: string;
  data: WishlistItem[] | WishlistItem;
}

export interface WishlistStatusResponse {
  status: string;
  data: {
    inWishlist: boolean;
  };
}

// Made with Bob