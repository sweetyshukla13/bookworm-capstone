export interface OrderItem {
  id: string;
  orderId: string;
  bookId: string;
  quantity: number;
  price: number;
  subtotal: number;
  book?: {
    id: string;
    title: string;
    author: string;
    coverImage: string;
    price: number;
    isbn?: string;
    description?: string;
    rating?: number;
    pages?: number;
    publisher?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ShippingAddress {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingAddressId: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  notes?: string;
  items?: OrderItem[];
  shippingAddress?: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: {
    bookId: string;
    quantity: number;
    price: number;
  }[];
  shippingAddressId: string;
  paymentMethod: string;
  totalAmount: number;
  notes?: string;
}

// Made with Bob