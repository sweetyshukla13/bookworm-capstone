import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { ReviewService, Review } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookService = inject(BookService);
  private reviewService = inject(ReviewService);
  private authService = inject(AuthService);

  book = signal<Book | undefined>(undefined);
  relatedBooks = signal<Book[]>([]);
  reviews = signal<Review[]>([]);
  userRating = signal(0);
  reviewText = signal('');
  isSubmittingReview = signal(false);
  reviewError = signal('');
  reviewSuccess = signal('');

  // Generate author image based on author name
  getAuthorImage(): string {
    const currentBook = this.book();
    if (!currentBook) return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop';
    
    // Use a consistent image based on author name hash
    const hash = currentBook.author.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const imageIndex = hash % 10; // Use 10 different author images
    const imageIds = [
      'photo-1472099645785-5658abf4ff4e', // Default
      'photo-1507003211169-0a1dd7228f2d',
      'photo-1500648767791-00dcc994a43e',
      'photo-1519345182560-3f2917c472ef',
      'photo-1506794778202-cad84cf45f1d',
      'photo-1552374196-c4e7ffc6e126',
      'photo-1531427186611-ecfd6d936c79',
      'photo-1557862921-37829c790f19',
      'photo-1566492031773-4f4e44671857',
      'photo-1438761681033-6461ffad8d80'
    ];
    return `https://images.unsplash.com/photo-${imageIds[imageIndex]}?w=200&h=200&fit=crop`;
  }

  getAuthorBio(): string {
    const currentBook = this.book();
    if (!currentBook) return '';
    
    // Generate a simple bio based on the author name
    return `${currentBook.author} is an acclaimed author known for their compelling storytelling and unique perspective. Their works have captivated readers worldwide, offering insights into the human experience through masterful prose and unforgettable characters. With a distinctive voice and profound understanding of their craft, ${currentBook.author} continues to be a significant figure in contemporary literature.`;
  }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const bookId = params['id'];
      
      // Fetch book details
      this.bookService.getBookById(bookId).subscribe({
        next: (foundBook) => {
          this.book.set(foundBook);
        },
        error: (error) => {
          console.error('Error loading book:', error);
        }
      });
      
      // Fetch related books
      this.bookService.getRelatedBooks(bookId).subscribe({
        next: (books) => {
          this.relatedBooks.set(books);
        },
        error: (error) => {
          console.error('Error loading related books:', error);
        }
      });

      // Fetch reviews for this book
      this.loadReviews(bookId);
    });
  }

  loadReviews(bookId: string): void {
    this.reviewService.getBookReviews(bookId).subscribe({
      next: (response) => {
        if (response.status === 'success' && Array.isArray(response.data)) {
          this.reviews.set(response.data);
        }
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
      }
    });
  }

  addToCart(): void {
    const currentBook = this.book();
    if (currentBook) {
      this.bookService.addToCart(currentBook);
    }
  }

  addToWishlist(): void {
    // Implement wishlist functionality
    console.log('Added to wishlist');
  }

  setRating(rating: number): void {
    this.userRating.set(rating);
  }

  submitReview(): void {
    // Check if user is logged in
    if (!this.authService.isAuthenticated()) {
      this.reviewError.set('Please log in to submit a review');
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
      return;
    }

    // Validate inputs
    if (this.userRating() === 0) {
      this.reviewError.set('Please select a rating');
      return;
    }

    if (!this.reviewText().trim()) {
      this.reviewError.set('Please enter a review');
      return;
    }

    const currentBook = this.book();
    if (!currentBook) {
      this.reviewError.set('Book not found');
      return;
    }

    // Clear previous messages
    this.reviewError.set('');
    this.reviewSuccess.set('');
    this.isSubmittingReview.set(true);

    // Auto-generate title from first 50 characters of review text
    const reviewTitle = this.reviewText().trim().substring(0, 50) + (this.reviewText().trim().length > 50 ? '...' : '');

    // Submit review
    this.reviewService.createReview(
      currentBook.id,
      this.userRating(),
      reviewTitle,
      this.reviewText()
    ).subscribe({
      next: (response) => {
        this.isSubmittingReview.set(false);
        if (response.status === 'success') {
          this.reviewSuccess.set('Review submitted successfully!');
          
          // Reset form
          this.userRating.set(0);
          this.reviewText.set('');
          
          // Reload reviews
          this.loadReviews(currentBook.id);
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            this.reviewSuccess.set('');
          }, 3000);
        }
      },
      error: (error) => {
        this.isSubmittingReview.set(false);
        console.error('Error submitting review:', error);
        
        if (error.status === 400 && error.error?.message) {
          this.reviewError.set(error.error.message);
        } else if (error.status === 401) {
          this.reviewError.set('Please log in to submit a review');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.reviewError.set('Failed to submit review. Please try again.');
        }
      }
    });
  }

  getStarArray(): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  onAddToCart(book: Book): void {
    this.bookService.addToCart(book);
  }
}

// Made with Bob
