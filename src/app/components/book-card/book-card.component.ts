import { Component, input, output, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Book } from '../../models/book.model';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})
export class BookCardComponent {
  private wishlistService = inject(WishlistService);
  private authService = inject(AuthService);

  book = input.required<Book>();
  addToCartClicked = output<Book>();
  
  // Check if book is in wishlist
  isInWishlist = computed(() =>
    this.wishlistService.isInWishlist(this.book().id)
  );

  isAuthenticated = computed(() => this.authService.isAuthenticated());

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.addToCartClicked.emit(this.book());
  }

  onToggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.isAuthenticated()) {
      alert('Please login to add items to wishlist');
      return;
    }

    this.wishlistService.toggleWishlist(this.book().id).subscribe({
      next: () => {
        const message = this.isInWishlist()
          ? 'Removed from wishlist'
          : 'Added to wishlist';
        console.log(message);
      },
      error: (error) => {
        console.error('Wishlist error:', error);
        alert('Failed to update wishlist. Please try again.');
      }
    });
  }

  getStarArray(): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }
}

// Made with Bob
