import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/addresses`;

  /**
   * Get all addresses for the authenticated user
   */
  getUserAddresses(): Observable<ApiResponse<Address[]>> {
    return this.http.get<ApiResponse<Address[]>>(this.apiUrl);
  }

  /**
   * Get a specific address by ID
   */
  getAddressById(id: string): Observable<ApiResponse<Address>> {
    return this.http.get<ApiResponse<Address>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new address
   */
  createAddress(address: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<Address>> {
    return this.http.post<ApiResponse<Address>>(this.apiUrl, address);
  }

  /**
   * Update an existing address
   */
  updateAddress(id: string, address: Partial<Address>): Observable<ApiResponse<Address>> {
    return this.http.put<ApiResponse<Address>>(`${this.apiUrl}/${id}`, address);
  }

  /**
   * Delete an address
   */
  deleteAddress(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}

// Made with Bob