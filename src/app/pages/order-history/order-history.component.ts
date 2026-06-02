import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { BookService } from '../../services/book.service';
import { Order, OrderItem } from '../../models/order.model';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error: string | null = null;
  expandedOrderId: string | null = null;

  private bookService = inject(BookService);

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    console.log('🔄 Loading orders...');
    this.loading = true;
    this.error = null;

    this.orderService.getUserOrders().subscribe({
      next: (response) => {
        console.log('✅ Orders loaded:', response.data);
        this.orders = response.data;
        this.loading = false;
        console.log('✅ Loading state set to false');
      },
      error: (error) => {
        console.error('❌ Error loading orders:', error);
        this.error = 'Failed to load order history. Please try again.';
        this.loading = false;
      }
    });
  }

  toggleOrderDetails(orderId: string): void {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  isOrderExpanded(orderId: string): boolean {
    return this.expandedOrderId === orderId;
  }

  getStatusColor(status: string): string {
    return this.orderService.getStatusColor(status);
  }

  getPaymentStatusColor(status: string): string {
    return this.orderService.getPaymentStatusColor(status);
  }

  formatStatus(status: string): string {
    return this.orderService.formatStatus(status);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatCurrency(amount: number | string | undefined): string {
    if (amount === undefined || amount === null) {
      return '₹0.00';
    }
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `₹${numAmount.toFixed(2)}`;
  }

  canCancelOrder(order: Order): boolean {
    return order.status !== 'delivered' && order.status !== 'cancelled';
  }

  cancelOrder(orderId: string): void {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    this.orderService.cancelOrder(orderId).subscribe({
      next: (response) => {
        alert('Order cancelled successfully');
        this.loadOrders(); // Reload orders to reflect the change
      },
      error: (error) => {
        console.error('Error cancelling order:', error);
        alert('Failed to cancel order. Please try again.');
      }
    });
  }

  viewBookDetails(bookId: string): void {
    this.router.navigate(['/book', bookId]);
  }

  getTotalItems(order: Order): number {
    return order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }

  /**
   * Buy a single item again - adds it to cart
   */
  buyItemAgain(item: OrderItem): void {
    if (!item.book) {
      alert('Book information not available');
      return;
    }

    // Fetch the latest book details and add to cart
    this.bookService.getBookById(item.bookId).subscribe({
      next: (book) => {
        if (!book) {
          alert('Book not found');
          return;
        }
        // Add the same quantity as in the original order
        for (let i = 0; i < item.quantity; i++) {
          this.bookService.addToCart(book);
        }
        alert(`Added ${item.quantity} x "${book.title}" to cart!`);
      },
      error: (error) => {
        console.error('Error adding item to cart:', error);
        alert('Failed to add item to cart. Please try again.');
      }
    });
  }

  /**
   * Buy all items from an order again
   */
  buyOrderAgain(order: Order): void {
    if (!order.items || order.items.length === 0) {
      alert('No items in this order');
      return;
    }

    if (!confirm(`Add all ${order.items.length} item(s) from this order to your cart?`)) {
      return;
    }

    let successCount = 0;
    let failCount = 0;
    const totalItems = order.items.length;

    order.items.forEach((item, index) => {
      if (!item.book) {
        failCount++;
        if (index === totalItems - 1) {
          this.showBuyAgainResult(successCount, failCount);
        }
        return;
      }

      this.bookService.getBookById(item.bookId).subscribe({
        next: (book) => {
          if (!book) {
            failCount++;
            if (index === totalItems - 1) {
              this.showBuyAgainResult(successCount, failCount);
            }
            return;
          }
          // Add the same quantity as in the original order
          for (let i = 0; i < item.quantity; i++) {
            this.bookService.addToCart(book);
          }
          successCount++;
          
          // Show result after processing all items
          if (index === totalItems - 1) {
            this.showBuyAgainResult(successCount, failCount);
          }
        },
        error: (error) => {
          console.error('Error adding item to cart:', error);
          failCount++;
          
          // Show result after processing all items
          if (index === totalItems - 1) {
            this.showBuyAgainResult(successCount, failCount);
          }
        }
      });
    });
  }

  private showBuyAgainResult(successCount: number, failCount: number): void {
    if (failCount === 0) {
      alert(`Successfully added all ${successCount} item(s) to cart!`);
    } else if (successCount === 0) {
      alert('Failed to add items to cart. Please try again.');
    } else {
      alert(`Added ${successCount} item(s) to cart. ${failCount} item(s) failed.`);
    }
  }
}

// Made with Bob