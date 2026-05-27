import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent {
  private bookService = inject(BookService);
  
  purchasedBooks = this.bookService.cart();

  ngOnInit(): void {
    // Clear cart after successful payment
    setTimeout(() => {
      this.bookService.clearCart();
    }, 3000);
  }
}

// Made with Bob
