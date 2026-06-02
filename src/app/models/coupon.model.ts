export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  expiryDate?: string;
  isActive: boolean;
}

export interface CouponValidationResponse {
  success: boolean;
  message: string;
  coupon?: Coupon;
  discountAmount?: number;
}

// Made with Bob
