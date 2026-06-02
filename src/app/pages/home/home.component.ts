import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { BookCardComponent } from '../../components/book-card/book-card.component';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, BookCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private bookService = inject(BookService);
  
  searchQuery = signal('');
  selectedLanguage = signal('All');
  selectedFormat = signal('All');
  selectedPriceRange = signal('All');
  selectedSort = signal('Relevance');
  selectedCategory = signal('All');

  allBooks = signal<Book[]>([]);
  
  ngOnInit(): void {
    this.loadBooks();
  }

  private loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.allBooks.set(books);
      },
      error: (error) => {
        console.error('Error loading books:', error);
      }
    });
  }
  
  get filteredBooks(): Book[] {
    let books = this.allBooks();
    
    // Filter by category
    if (this.selectedCategory() !== 'All') {
      books = books.filter(book => book.category === this.selectedCategory());
    }
    
    // Filter by search query
    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      books = books.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
      );
    }
    
    // Filter by language
    if (this.selectedLanguage() !== 'All') {
      books = books.filter(book => book.language === this.selectedLanguage());
    }
    
    // Filter by format
    if (this.selectedFormat() !== 'All') {
      books = books.filter(book => book.format === this.selectedFormat());
    }
    
    // Filter by price range
    if (this.selectedPriceRange() !== 'All') {
      const range = this.selectedPriceRange();
      if (range === '0-200') {
        books = books.filter(book => book.price >= 0 && book.price <= 200);
      } else if (range === '200-500') {
        books = books.filter(book => book.price > 200 && book.price <= 500);
      } else if (range === '500+') {
        books = books.filter(book => book.price > 500);
      }
    }
    
    // Sort books
    const sortBy = this.selectedSort();
    if (sortBy === 'Price: Low to High') {
      books = books.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      books = books.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Rating') {
      books = books.sort((a, b) => b.rating - a.rating);
    }
    
    return books;
  }

  get recommendedBooks(): Book[] {
    return this.filteredBooks.slice(0, 3);
  }

  get bestsellers(): Book[] {
    return this.filteredBooks.slice(3, 6);
  }

  get newLaunches(): Book[] {
    return this.filteredBooks.slice(6, 9);
  }

  onCategorySelected(category: string): void {
    this.selectedCategory.set(category);
  }

  onAddToCart(book: Book): void {
    this.bookService.addToCart(book);
  }
}

// Made with Bob
