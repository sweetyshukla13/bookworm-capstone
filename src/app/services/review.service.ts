import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
  };
}

export interface ReviewResponse {
  status: string;
  message?: string;
  data: Review | Review[];
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  /**
   * Create a new review
   */
  createReview(bookId: string, rating: number, title: string, comment: string): Observable<ReviewResponse> {
    return this.http.post<ReviewResponse>(this.apiUrl, {
      bookId,
      rating,
      title,
      comment
    });
  }

  /**
   * Get all reviews for a book
   */
  getBookReviews(bookId: string): Observable<ReviewResponse> {
    return this.http.get<ReviewResponse>(`${this.apiUrl}/book/${bookId}`);
  }

  /**
   * Get current user's reviews
   */
  getUserReviews(): Observable<ReviewResponse> {
    return this.http.get<ReviewResponse>(`${this.apiUrl}/my-reviews`);
  }

  /**
   * Update a review
   */
  updateReview(reviewId: string, rating: number, title: string, comment: string): Observable<ReviewResponse> {
    return this.http.put<ReviewResponse>(`${this.apiUrl}/${reviewId}`, {
      rating,
      title,
      comment
    });
  }

  /**
   * Delete a review
   */
  deleteReview(reviewId: string): Observable<ReviewResponse> {
    return this.http.delete<ReviewResponse>(`${this.apiUrl}/${reviewId}`);
  }
}

// Made with Bob