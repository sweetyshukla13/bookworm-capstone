import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { WishlistItem, WishlistResponse, WishlistStatusResponse } from '../models/wishlist.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = `${environment.apiUrl}/wishlist`;
  
  // Signal to track wishlist items
  wishlistItems = signal<WishlistItem[]>([]);
  wishlistCount = signal<number>(0);

  constructor(private http: HttpClient) {
    this.loadWishlist();
  }

  /**
   * Load user's wishlist from API
   */
  loadWishlist(): void {
    this.getUserWishlist().subscribe({
      next: (response) => {
        const items = Array.isArray(response.data) ? response.data : [];
        this.wishlistItems.set(items);
        this.wishlistCount.set(items.length);
      },
      error: (error) => {
        console.error('Error loading wishlist:', error);
        this.wishlistItems.set([]);
        this.wishlistCount.set(0);
      }
    });
  }

  /**
   * Get all wishlist items for the authenticated user
   */
  getUserWishlist(): Observable<WishlistResponse> {
    // Add cache-busting headers and timestamp to prevent 304 responses
    const timestamp = new Date().getTime();
    return this.http.get<WishlistResponse>(`${this.apiUrl}?_t=${timestamp}`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }

  /**
   * Add a book to wishlist
   */
  addToWishlist(bookId: string): Observable<WishlistResponse> {
    return this.http.post<WishlistResponse>(this.apiUrl, { bookId }).pipe(
      tap((response) => {
        // Update local state
        const currentItems = this.wishlistItems();
        const newItem = response.data as WishlistItem;
        this.wishlistItems.set([...currentItems, newItem]);
        this.wishlistCount.set(this.wishlistCount() + 1);
      })
    );
  }

  /**
   * Remove a book from wishlist
   */
  removeFromWishlist(bookId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${bookId}`).pipe(
      tap(() => {
        // Update local state
        const currentItems = this.wishlistItems();
        const updatedItems = currentItems.filter(item => item.bookId !== bookId);
        this.wishlistItems.set(updatedItems);
        this.wishlistCount.set(updatedItems.length);
      })
    );
  }

  /**
   * Check if a book is in the wishlist
   */
  checkWishlistStatus(bookId: string): Observable<WishlistStatusResponse> {
    return this.http.get<WishlistStatusResponse>(`${this.apiUrl}/check/${bookId}`);
  }

  /**
   * Check if book is in wishlist (from local state)
   */
  isInWishlist(bookId: string): boolean {
    return this.wishlistItems().some(item => item.bookId === bookId);
  }

  /**
   * Toggle wishlist status for a book
   */
  toggleWishlist(bookId: string): Observable<any> {
    if (this.isInWishlist(bookId)) {
      return this.removeFromWishlist(bookId);
    } else {
      return this.addToWishlist(bookId);
    }
  }

  /**
   * Clear entire wishlist
   */
  clearWishlist(): Observable<any> {
    return this.http.delete(this.apiUrl).pipe(
      tap(() => {
        this.wishlistItems.set([]);
        this.wishlistCount.set(0);
      })
    );
  }

  /**
   * Get wishlist count
   */
  getWishlistCount(): number {
    return this.wishlistCount();
  }
}

// Made with Bob