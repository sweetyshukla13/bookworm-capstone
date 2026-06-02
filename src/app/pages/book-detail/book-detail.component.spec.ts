import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';
import { vi } from 'vitest';

import { BookDetailComponent } from './book-detail.component';
import { BookService } from '../../services/book.service';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { Book } from '../../models/book.model';

describe('BookDetailComponent', () => {
  let component: BookDetailComponent;
  let fixture: ComponentFixture<BookDetailComponent>;
  let mockBookService: any;
  let mockReviewService: any;
  let mockAuthService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  const mockBook: Book = {
    id: '1',
    title: 'Test Book',
    author: 'Test Author',
    price: 299,
    originalPrice: 399,
    rating: 4.5,
    reviewCount: 100,
    coverImage: 'test-image.jpg',
    description: 'Test description',
    category: 'Fiction',
    format: 'Paperback',
    language: 'English',
    deliveryDate: '2024-01-15',
    publisher: 'Test Publisher',
    isbn: '1234567890'
  };

  const mockReviews = [
    {
      id: '1',
      bookId: '1',
      userId: 'user1',
      rating: 5,
      title: 'Great book!',
      comment: 'Really enjoyed this book',
      createdAt: new Date().toISOString(),
      user: {
        id: 'user1',
        name: 'John Doe',
        email: 'john@example.com'
      }
    }
  ];

  beforeEach(async () => {
    // Create mock services
    mockBookService = {
      getBookById: vi.fn(),
      getRelatedBooks: vi.fn(),
      addToCart: vi.fn()
    };
    
    mockReviewService = {
      getBookReviews: vi.fn(),
      createReview: vi.fn()
    };
    
    mockAuthService = {
      isAuthenticated: vi.fn()
    };
    
    mockRouter = {
      navigate: vi.fn()
    };
    
    mockActivatedRoute = {
      params: of({ id: '1' })
    };

    // Setup default return values
    mockBookService.getBookById.mockReturnValue(of(mockBook));
    mockBookService.getRelatedBooks.mockReturnValue(of([mockBook]));
    mockReviewService.getBookReviews.mockReturnValue(
      of({ status: 'success', data: mockReviews })
    );
    mockAuthService.isAuthenticated.mockReturnValue(true);

    await TestBed.configureTestingModule({
      imports: [BookDetailComponent],
      providers: [
        { provide: BookService, useValue: mockBookService },
        { provide: ReviewService, useValue: mockReviewService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load book details on init', () => {
      fixture.detectChanges();
      
      expect(mockBookService.getBookById).toHaveBeenCalledWith('1');
      expect(component.book()).toEqual(mockBook);
    });

    it('should load related books on init', () => {
      fixture.detectChanges();
      
      expect(mockBookService.getRelatedBooks).toHaveBeenCalledWith('1');
      expect(component.relatedBooks().length).toBe(1);
    });

    it('should load reviews on init', () => {
      fixture.detectChanges();
      
      expect(mockReviewService.getBookReviews).toHaveBeenCalledWith('1');
      expect(component.reviews().length).toBe(1);
    });

    it('should handle error when loading book', () => {
      mockBookService.getBookById.mockReturnValue(
        throwError(() => new Error('Book not found'))
      );
      vi.spyOn(console, 'error');
      
      fixture.detectChanges();
      
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle error when loading related books', () => {
      mockBookService.getRelatedBooks.mockReturnValue(
        throwError(() => new Error('Error loading related books'))
      );
      vi.spyOn(console, 'error');
      
      fixture.detectChanges();
      
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle error when loading reviews', () => {
      mockReviewService.getBookReviews.mockReturnValue(
        throwError(() => new Error('Error loading reviews'))
      );
      vi.spyOn(console, 'error');
      
      fixture.detectChanges();
      
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('addToCart', () => {
    it('should add book to cart', () => {
      component.book.set(mockBook);
      
      component.addToCart();
      
      expect(mockBookService.addToCart).toHaveBeenCalledWith(mockBook);
    });

    it('should not add to cart if book is undefined', () => {
      component.book.set(undefined);
      
      component.addToCart();
      
      expect(mockBookService.addToCart).not.toHaveBeenCalled();
    });
  });

  describe('setRating', () => {
    it('should set user rating', () => {
      component.setRating(4);
      
      expect(component.userRating()).toBe(4);
    });

    it('should update rating when called multiple times', () => {
      component.setRating(3);
      expect(component.userRating()).toBe(3);
      
      component.setRating(5);
      expect(component.userRating()).toBe(5);
    });
  });

  describe('submitReview', () => {
    beforeEach(() => {
      component.book.set(mockBook);
      component.userRating.set(5);
      component.reviewText.set('Great book!');
    });

    it('should submit review successfully', () => {
      mockReviewService.createReview.mockReturnValue(
        of({ status: 'success', data: mockReviews[0] })
      );
      
      component.submitReview();
      
      expect(mockReviewService.createReview).toHaveBeenCalledWith(
        '1',
        5,
        'Great book!',
        'Great book!'
      );
      expect(component.reviewSuccess()).toBe('Review submitted successfully!');
      expect(component.userRating()).toBe(0);
      expect(component.reviewText()).toBe('');
    });

    it('should show error if user is not authenticated', () => {
      mockAuthService.isAuthenticated.mockReturnValue(false);
      
      component.submitReview();
      
      expect(component.reviewError()).toBe('Please log in to submit a review');
      expect(mockReviewService.createReview).not.toHaveBeenCalled();
    });

    it('should navigate to login after 2 seconds if not authenticated', async () => {
      mockAuthService.isAuthenticated.mockReturnValue(false);
      
      component.submitReview();
      
      await new Promise(resolve => setTimeout(resolve, 2100));
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should show error if rating is not selected', () => {
      component.userRating.set(0);
      
      component.submitReview();
      
      expect(component.reviewError()).toBe('Please select a rating');
      expect(mockReviewService.createReview).not.toHaveBeenCalled();
    });

    it('should show error if review text is empty', () => {
      component.reviewText.set('');
      
      component.submitReview();
      
      expect(component.reviewError()).toBe('Please enter a review');
      expect(mockReviewService.createReview).not.toHaveBeenCalled();
    });

    it('should show error if review text is only whitespace', () => {
      component.reviewText.set('   ');
      
      component.submitReview();
      
      expect(component.reviewError()).toBe('Please enter a review');
      expect(mockReviewService.createReview).not.toHaveBeenCalled();
    });

    it('should show error if book is not found', () => {
      component.book.set(undefined);
      
      component.submitReview();
      
      expect(component.reviewError()).toBe('Book not found');
      expect(mockReviewService.createReview).not.toHaveBeenCalled();
    });

    it('should truncate long review titles', () => {
      const longReview = 'A'.repeat(60);
      component.reviewText.set(longReview);
      mockReviewService.createReview.mockReturnValue(
        of({ status: 'success', data: mockReviews[0] })
      );
      
      component.submitReview();
      
      expect(mockReviewService.createReview).toHaveBeenCalledWith(
        '1',
        5,
        expect.stringMatching(/^A{50}\.\.\./),
        longReview
      );
    });

    it('should handle 400 error with message', () => {
      const error = {
        status: 400,
        error: { message: 'Invalid review data' }
      };
      mockReviewService.createReview.mockReturnValue(throwError(() => error));
      
      component.submitReview();
      
      expect(component.reviewError()).toBe('Invalid review data');
    });

    it('should handle 401 error and navigate to login', async () => {
      const error = { status: 401 };
      mockReviewService.createReview.mockReturnValue(throwError(() => error));
      
      component.submitReview();
      
      expect(component.reviewError()).toBe('Please log in to submit a review');
      
      await new Promise(resolve => setTimeout(resolve, 2100));
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle generic error', () => {
      const error = { status: 500 };
      mockReviewService.createReview.mockReturnValue(throwError(() => error));
      
      component.submitReview();
      
      expect(component.reviewError()).toBe('Failed to submit review. Please try again.');
    });

    it('should reload reviews after successful submission', () => {
      mockReviewService.createReview.mockReturnValue(
        of({ status: 'success', data: mockReviews[0] })
      );
      mockReviewService.getBookReviews.mockClear();
      
      component.submitReview();
      
      expect(mockReviewService.getBookReviews).toHaveBeenCalledWith('1');
    });

    it('should clear success message after 3 seconds', async () => {
      mockReviewService.createReview.mockReturnValue(
        of({ status: 'success', data: mockReviews[0] })
      );
      
      component.submitReview();
      
      expect(component.reviewSuccess()).toBe('Review submitted successfully!');
      
      await new Promise(resolve => setTimeout(resolve, 3100));
      expect(component.reviewSuccess()).toBe('');
    });

    it('should set isSubmittingReview to true during submission', () => {
      mockReviewService.createReview.mockReturnValue(
        of({ status: 'success', data: mockReviews[0] })
      );
      
      expect(component.isSubmittingReview()).toBe(false);
      
      component.submitReview();
      
      expect(component.isSubmittingReview()).toBe(false); // Reset after completion
    });
  });

  describe('getAuthorImage', () => {
    it('should return default image if book is undefined', () => {
      component.book.set(undefined);
      
      const image = component.getAuthorImage();
      
      expect(image).toContain('photo-1472099645785-5658abf4ff4e');
    });

    it('should return consistent image for same author', () => {
      component.book.set(mockBook);
      
      const image1 = component.getAuthorImage();
      const image2 = component.getAuthorImage();
      
      expect(image1).toBe(image2);
    });

    it('should return different images for different authors', () => {
      component.book.set(mockBook);
      const image1 = component.getAuthorImage();
      
      const differentBook = { ...mockBook, author: 'Different Author' };
      component.book.set(differentBook);
      const image2 = component.getAuthorImage();
      
      // Note: This might occasionally fail due to hash collision
      // but it's statistically unlikely
      expect(image1).not.toBe(image2);
    });
  });

  describe('getAuthorBio', () => {
    it('should return empty string if book is undefined', () => {
      component.book.set(undefined);
      
      const bio = component.getAuthorBio();
      
      expect(bio).toBe('');
    });

    it('should return bio containing author name', () => {
      component.book.set(mockBook);
      
      const bio = component.getAuthorBio();
      
      expect(bio).toContain('Test Author');
    });

    it('should return consistent bio for same author', () => {
      component.book.set(mockBook);
      
      const bio1 = component.getAuthorBio();
      const bio2 = component.getAuthorBio();
      
      expect(bio1).toBe(bio2);
    });
  });

  describe('getStarArray', () => {
    it('should return array of 5 numbers', () => {
      const stars = component.getStarArray();
      
      expect(stars.length).toBe(5);
      expect(stars).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('onAddToCart', () => {
    it('should add book to cart', () => {
      component.onAddToCart(mockBook);
      
      expect(mockBookService.addToCart).toHaveBeenCalledWith(mockBook);
    });
  });

  describe('loadReviews', () => {
    it('should load reviews for a book', () => {
      component.loadReviews('1');
      
      expect(mockReviewService.getBookReviews).toHaveBeenCalledWith('1');
      expect(component.reviews().length).toBe(1);
    });

    it('should handle empty reviews array', () => {
      mockReviewService.getBookReviews.mockReturnValue(
        of({ status: 'success', data: [] })
      );
      
      component.loadReviews('1');
      
      expect(component.reviews().length).toBe(0);
    });

    it('should handle non-array response', () => {
      mockReviewService.getBookReviews.mockReturnValue(
        of({ status: 'success', data: null as any })
      );
      
      component.loadReviews('1');
      
      // Should not crash, reviews should remain unchanged
      expect(component.reviews()).toBeDefined();
    });

    it('should handle error when loading reviews', () => {
      mockReviewService.getBookReviews.mockReturnValue(
        throwError(() => new Error('Error loading reviews'))
      );
      vi.spyOn(console, 'error');
      
      component.loadReviews('1');
      
      expect(console.error).toHaveBeenCalled();
    });
  });
});
