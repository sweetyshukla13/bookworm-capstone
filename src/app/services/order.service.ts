import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order, CreateOrderRequest } from '../models/order.model';

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  /**
   * Get all orders for the authenticated user
   */
  getUserOrders(): Observable<ApiResponse<Order[]>> {
    // Add cache-busting headers to prevent browser caching
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    // Add timestamp to URL to prevent caching
    const timestamp = new Date().getTime();
    return this.http.get<ApiResponse<Order[]>>(`${this.apiUrl}?_t=${timestamp}`, { headers });
  }

  /**
   * Get a specific order by ID
   */
  getOrderById(orderId: string): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.apiUrl}/${orderId}`);
  }

  /**
   * Create a new order
   */
  createOrder(orderData: CreateOrderRequest): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(this.apiUrl, orderData);
  }

  /**
   * Cancel an order
   */
  cancelOrder(orderId: string): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(
      `${this.apiUrl}/${orderId}/status`,
      { status: 'cancelled' }
    );
  }

  /**
   * Get order status badge color
   */
  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  /**
   * Get payment status badge color
   */
  getPaymentStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  /**
   * Format order status for display
   */
  formatStatus(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

// Made with Bob