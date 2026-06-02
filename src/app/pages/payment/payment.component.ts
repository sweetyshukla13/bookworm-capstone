import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BookService } from '../../services/book.service';
import { OrderService } from '../../services/order.service';
import { AddressService, Address } from '../../services/address.service';
import { Coupon } from '../../models/coupon.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  private bookService = inject(BookService);
  private orderService = inject(OrderService);
  private addressService = inject(AddressService);
  private router = inject(Router);
  private http = inject(HttpClient);

  orderSummary = computed(() => this.bookService.calculateOrderSummary());
  selectedPaymentMethod = signal<'credit' | 'debit' | 'upi' | 'wallet'>('credit');
  appliedCoupon = this.bookService.coupon;
  
  // Payment details
  cardNumber = '';
  cardName = '';
  cvv = '';
  expiryDate = '';
  
  // Saved address functionality
  useSavedAddress = signal(false);
  savedAddresses = signal<Address[]>([]);
  selectedAddressId = signal<string | null>(null);
  loadingAddresses = signal(false);
  
  // Shipping address
  fullName = '';
  addressLine1 = '';
  addressLine2 = '';
  city = '';
  state = '';
  postalCode = '';
  country = 'India';
  phone = '';
  
  // Coupon related properties
  couponCode = signal('');
  couponMessage = signal('');
  isApplyingCoupon = signal(false);
  couponError = signal(false);
  
  // Processing state
  isProcessing = signal(false);
  
  ngOnInit(): void {
    // Load saved addresses when component initializes
    this.loadSavedAddresses();
  }

  loadSavedAddresses(): void {
    this.loadingAddresses.set(true);
    this.addressService.getUserAddresses().subscribe({
      next: (response) => {
        this.savedAddresses.set(response.data);
        this.loadingAddresses.set(false);
        // Auto-select default address if available
        const defaultAddress = response.data.find(addr => addr.isDefault);
        if (defaultAddress) {
          this.selectedAddressId.set(defaultAddress.id);
        }
      },
      error: (error) => {
        console.error('Error loading addresses:', error);
        this.loadingAddresses.set(false);
      }
    });
  }

  toggleUseSavedAddress(): void {
    this.useSavedAddress.set(!this.useSavedAddress());
    if (this.useSavedAddress() && this.savedAddresses().length === 0) {
      this.loadSavedAddresses();
    }
  }

  selectAddress(addressId: string): void {
    this.selectedAddressId.set(addressId);
  }

  getSelectedAddress(): Address | null {
    const addressId = this.selectedAddressId();
    if (!addressId) return null;
    return this.savedAddresses().find(addr => addr.id === addressId) || null;
  }

  selectPaymentMethod(method: 'credit' | 'debit' | 'upi' | 'wallet'): void {
    this.selectedPaymentMethod.set(method);
  }

  applyCoupon(): void {
    const code = this.couponCode().trim();
    
    if (!code) {
      this.couponMessage.set('Please enter a coupon code');
      this.couponError.set(true);
      return;
    }

    this.isApplyingCoupon.set(true);
    this.couponMessage.set('');
    this.couponError.set(false);

    this.bookService.validateCoupon(code).subscribe({
      next: (response) => {
        this.isApplyingCoupon.set(false);
        if (response.success) {
          this.couponMessage.set(response.message || 'Coupon applied successfully!');
          this.couponError.set(false);
          this.couponCode.set('');
        } else {
          this.couponMessage.set(response.message || 'Invalid coupon code');
          this.couponError.set(true);
        }
      },
      error: (error) => {
        this.isApplyingCoupon.set(false);
        this.couponMessage.set('Failed to apply coupon. Please try again.');
        this.couponError.set(true);
      }
    });
  }

  removeCoupon(): void {
    this.bookService.removeCoupon();
    this.couponMessage.set('Coupon removed');
    this.couponError.set(false);
    setTimeout(() => this.couponMessage.set(''), 3000);
  }

  processPayment(): void {
    console.log('🔥 processPayment called!', {
      cart: this.bookService.cart(),
      paymentMethod: this.selectedPaymentMethod(),
      total: this.orderSummary().total,
      useSavedAddress: this.useSavedAddress(),
      selectedAddressId: this.selectedAddressId()
    });
    
    // Validate cart
    const cart = this.bookService.cart();
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    this.isProcessing.set(true);

    // Check if using saved address
    if (this.useSavedAddress()) {
      const selectedAddress = this.getSelectedAddress();
      if (!selectedAddress) {
        alert('Please select a saved address');
        this.isProcessing.set(false);
        return;
      }
      
      // Use the selected saved address
      this.createOrderWithAddress(selectedAddress.id);
    } else {
      // Create a new default address
      const addressData = {
        fullName: 'Customer',
        addressLine1: 'Default Address',
        addressLine2: '',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
        phoneNumber: '9999999999'
      };

      this.http.post<any>(`${environment.apiUrl}/addresses`, addressData).subscribe({
        next: (addressResponse) => {
          this.createOrderWithAddress(addressResponse.data.id);
        },
        error: (error) => {
          console.error('Error creating address:', error);
          this.isProcessing.set(false);
          alert('Failed to process payment. Please try again.');
        }
      });
    }
  }

  private createOrderWithAddress(shippingAddressId: string): void {
    const cart = this.bookService.cart();
    const orderData = {
      items: cart.map(item => ({
        bookId: item.book.id,
        quantity: item.quantity,
        price: item.book.price
      })),
      shippingAddressId: shippingAddressId,
      paymentMethod: this.selectedPaymentMethod(),
      totalAmount: this.orderSummary().total,
      notes: undefined
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (orderResponse) => {
        console.log('Order created successfully:', orderResponse);
        this.isProcessing.set(false);
        // Clear cart and navigate to success page
        this.bookService.clearCart();
        this.router.navigate(['/payment-success'], {
          state: { orderId: orderResponse.data.id, orderNumber: orderResponse.data.orderNumber }
        });
      },
      error: (error) => {
        console.error('Error creating order:', error);
        this.isProcessing.set(false);
        alert('Failed to create order. Please try again.');
      }
    });
  }
}

// Made with Bob
