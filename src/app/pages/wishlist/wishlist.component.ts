import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { BookService } from '../../services/book.service';
import { WishlistItem } from '../../models/wishlist.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  private wishlistService = inject(WishlistService);
  private bookService = inject(BookService);
  private router = inject(Router);

  wishlistItems = signal<WishlistItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.loading.set(true);
    this.error.set(null);

    this.wishlistService.getUserWishlist().subscribe({
      next: (response) => {
        console.log('Wishlist API Response:', response);
        const items = Array.isArray(response.data) ? response.data : [];
        console.log('Wishlist Items:', items);
        console.log('First item book data:', items[0]?.book);
        this.wishlistItems.set(items);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading wishlist:', error);
        this.error.set('Failed to load wishlist. Please try again.');
        this.loading.set(false);
      }
    });
  }

  removeFromWishlist(bookId: string): void {
    if (!confirm('Remove this book from your wishlist?')) {
      return;
    }

    this.wishlistService.removeFromWishlist(bookId).subscribe({
      next: () => {
        // Update local state
        const currentItems = this.wishlistItems();
        this.wishlistItems.set(currentItems.filter(item => item.bookId !== bookId));
      },
      error: (error) => {
        console.error('Error removing from wishlist:', error);
        alert('Failed to remove from wishlist. Please try again.');
      }
    });
  }

  addToCart(item: WishlistItem): void {
    if (item.book) {
      this.bookService.addToCart(item.book);
      alert('Added to cart!');
    }
  }

  addAllToCart(): void {
    const items = this.wishlistItems();
    if (items.length === 0) return;

    items.forEach(item => {
      if (item.book) {
        this.bookService.addToCart(item.book);
      }
    });

    alert(`Added ${items.length} items to cart!`);
  }

  clearWishlist(): void {
    if (!confirm('Are you sure you want to clear your entire wishlist?')) {
      return;
    }

    this.wishlistService.clearWishlist().subscribe({
      next: () => {
        this.wishlistItems.set([]);
      },
      error: (error) => {
        console.error('Error clearing wishlist:', error);
        alert('Failed to clear wishlist. Please try again.');
      }
    });
  }

  viewBookDetails(bookId: string): void {
    this.router.navigate(['/book', bookId]);
  }

  formatCurrency(amount: number | string | undefined): string {
    if (amount === undefined || amount === null) return '₹0.00';
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return '₹0.00';
    return `₹${numAmount.toFixed(2)}`;
  }

  calculateSavings(item: WishlistItem): number {
    if (item.book?.originalPrice && item.book?.price) {
      return item.book.originalPrice - item.book.price;
    }
    return 0;
  }

  getTotalValue(): number {
    return this.wishlistItems().reduce((total, item) => {
      return total + (item.book?.price || 0);
    }, 0);
  }

  getTotalSavings(): number {
    return this.wishlistItems().reduce((total, item) => {
      return total + this.calculateSavings(item);
    }, 0);
  }
}

// Made with Bob