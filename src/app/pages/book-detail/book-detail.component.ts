import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);

  book = signal<Book | undefined>(undefined);
  relatedBooks = signal<Book[]>([]);
  userRating = signal(0);
  reviewText = signal('');

  mockAuthor = {
    name: 'Daniel Reed',
    bio: 'Daniel Reed is a writer, minimalist, and productivity coach based in San Francisco. With a passion for intentional living, Daniel has dedicated his career to helping people declutter their lives, both physically and mentally. He is the author of The Joy of Minimalism, an acclaimed guide to decluttering not just your space, but your mind. His other works include Less, But Better and The Focus Reset, which have helped thousands rethink consumption, prioritize what truly matters, and build sustainable systems for personal growth.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'
  };

  mockReviews = [
    {
      id: '1',
      userName: 'John Smith',
      rating: 5,
      comment: 'The accordion Component delivers large amounts of content in a small space through progressive disclosure. The user gets key details about the underlying content and can choose to expand that content within the constraints of the accordion.',
      date: '2024-01-15'
    }
  ];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const bookId = params['id'];
      const foundBook = this.bookService.getBookById(bookId);
      this.book.set(foundBook);
      
      if (foundBook) {
        this.relatedBooks.set(this.bookService.getRelatedBooks(bookId));
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
    console.log('Review submitted:', {
      rating: this.userRating(),
      text: this.reviewText()
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
