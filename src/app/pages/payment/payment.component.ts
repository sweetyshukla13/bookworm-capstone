import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  private bookService = inject(BookService);
  private router = inject(Router);

  orderSummary = this.bookService.calculateOrderSummary();
  selectedPaymentMethod = signal<'credit' | 'debit' | 'upi' | 'wallet'>('credit');
  
  cardNumber = '';
  cardName = '';
  cvv = '';
  expiryDate = '';

  selectPaymentMethod(method: 'credit' | 'debit' | 'upi' | 'wallet'): void {
    this.selectedPaymentMethod.set(method);
  }

  processPayment(): void {
    // Simulate payment processing
    this.router.navigate(['/payment-success']);
  }
}

// Made with Bob
