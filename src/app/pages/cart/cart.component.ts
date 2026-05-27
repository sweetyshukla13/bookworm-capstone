import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  private bookService = inject(BookService);
  private router = inject(Router);

  cartItems = this.bookService.cart;
  orderSummary = computed(() => this.bookService.calculateOrderSummary());

  // Address form
  useSavedAddress = false;
  firstName = '';
  lastName = '';
  address = '';
  email = '';
  city = '';
  pin = '';
  phoneNumber = '';
  state = '';
  country = 'India';
  couponCode = '';

  updateQuantity(bookId: string, change: number): void {
    const item = this.cartItems().find(i => i.book.id === bookId);
    if (item) {
      this.bookService.updateQuantity(bookId, item.quantity + change);
    }
  }

  removeItem(bookId: string): void {
    this.bookService.removeFromCart(bookId);
  }

  applyCoupon(): void {
    console.log('Applying coupon:', this.couponCode);
  }

  proceedToPayment(): void {
    if (this.cartItems().length === 0) {
      return;
    }
    this.router.navigate(['/payment']);
  }
}

// Made with Bob
