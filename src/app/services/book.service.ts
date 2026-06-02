import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, of, map, switchMap } from 'rxjs';
import { Book, CartItem, OrderSummary } from '../models/book.model';
import { Coupon, CouponValidationResponse } from '../models/coupon.model';
import { environment } from '../../environments/environment';

interface ApiResponse<T> {
  success?: boolean;
  status?: string;
  message?: string;
  data?: T;
}

interface ApiCategory {
  id: string | number;
  name: string;
  description?: string;
}

interface ApiBook extends Omit<Book, 'category' | 'deliveryDate' | 'tags'> {
  category?: string | ApiCategory;
  deliveryDate?: string;
  tags?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private cartItems = signal<CartItem[]>([]);
  private appliedCoupon = signal<Coupon | null>(null);
  private readonly CART_STORAGE_KEY = 'bookworm_cart';
  
  readonly cart = this.cartItems.asReadonly();
  readonly coupon = this.appliedCoupon.asReadonly();
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.loadCartFromStorage();
  }

  private mapBook(apiBook: ApiBook): Book {
    const categoryName = typeof apiBook.category === 'string'
      ? apiBook.category
      : apiBook.category?.name || 'General';

    return {
      ...apiBook,
      category: categoryName,
      deliveryDate: apiBook.deliveryDate || 'Mon, 21 Jul',
      tags: apiBook.tags?.length ? apiBook.tags : [categoryName]
    };
  }

  private loadCartFromStorage(): void {
    const cartJson = localStorage.getItem(this.CART_STORAGE_KEY);
    if (cartJson) {
      try {
        const cart = JSON.parse(cartJson);
        this.cartItems.set(cart);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    }
  }

  private saveCartToStorage(): void {
    localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(this.cartItems()));
  }

  getBooks(): Observable<Book[]> {
    return this.http.get<ApiResponse<ApiBook[]>>(`${this.apiUrl}/books`)
      .pipe(
        map(response => (response.data || []).map(book => this.mapBook(book))),
        catchError(error => {
          console.error('Error fetching books:', error);
          return of([]);
        })
      );
  }

  getBookById(id: string): Observable<Book | undefined> {
    return this.http.get<ApiResponse<ApiBook>>(`${this.apiUrl}/books/${id}`)
      .pipe(
        map(response => response.data ? this.mapBook(response.data) : undefined),
        catchError(error => {
          console.error('Error fetching book:', error);
          return of(undefined);
        })
      );
  }

  getBooksByCategory(category: string): Observable<Book[]> {
    let params = new HttpParams();
    if (category && category !== 'All') {
      params = params.set('category', category);
    }

    return this.http.get<ApiResponse<ApiBook[]>>(`${this.apiUrl}/books`, { params })
      .pipe(
        map(response => (response.data || []).map(book => this.mapBook(book))),
        catchError(error => {
          console.error('Error fetching books by category:', error);
          return of([]);
        })
      );
  }

  getRelatedBooks(bookId: string, limit: number = 4): Observable<Book[]> {
    // First get the current book to find its category, then get all books and filter
    return this.getBookById(bookId).pipe(
      switchMap(currentBook => {
        if (!currentBook || !currentBook.category) {
          return of([]);
        }
        // Get all books and filter by same category
        return this.getBooks().pipe(
          map(allBooks =>
            allBooks
              .filter(b =>
                b.id !== bookId && // Exclude current book
                b.category === currentBook.category // Same category
              )
              .slice(0, limit) // Limit results
          )
        );
      }),
      catchError(error => {
        console.error('Error fetching related books:', error);
        return of([]);
      })
    );
  }

  // Cart operations remain local (not API-based for now)
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
    
    this.saveCartToStorage();
  }

  removeFromCart(bookId: string): void {
    this.cartItems.set(
      this.cartItems().filter(item => item.book.id !== bookId)
    );
    this.saveCartToStorage();
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
    this.saveCartToStorage();
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
    
    // Calculate coupon discount
    let discount = 0;
    const appliedCoupon = this.appliedCoupon();
    if (appliedCoupon && appliedCoupon.isActive) {
      if (appliedCoupon.discountType === 'percentage') {
        discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
        if (appliedCoupon.maxDiscountAmount) {
          discount = Math.min(discount, appliedCoupon.maxDiscountAmount);
        }
      } else if (appliedCoupon.discountType === 'fixed') {
        discount = appliedCoupon.discountValue;
      }
    }
    
    const total = subtotal + tax + deliveryCharges - discount;

    return { subtotal, tax, deliveryCharges, discount, total };
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.appliedCoupon.set(null);
    this.saveCartToStorage();
  }

  // Coupon operations
  validateCoupon(couponCode: string): Observable<CouponValidationResponse> {
    return this.http.post<CouponValidationResponse>(
      `${this.apiUrl}/coupons/validate`,
      { code: couponCode, orderAmount: this.calculateOrderSummary().subtotal }
    ).pipe(
      tap(response => {
        if (response.success && response.coupon) {
          this.appliedCoupon.set(response.coupon);
        }
      }),
      catchError(error => {
        console.error('Error validating coupon:', error);
        return of({
          success: false,
          message: error.error?.message || 'Failed to validate coupon. Please try again.'
        });
      })
    );
  }

  removeCoupon(): void {
    this.appliedCoupon.set(null);
  }

  getAppliedCoupon(): Coupon | null {
    return this.appliedCoupon();
  }
}

// Made with Bob
