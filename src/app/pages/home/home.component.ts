import { Component, inject, signal } from '@angular/core';
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
export class HomeComponent {
  private bookService = inject(BookService);
  
  searchQuery = signal('');
  selectedLanguage = signal('All');
  selectedFormat = signal('All');
  selectedPriceRange = signal('All');
  selectedSort = signal('Relevance');
  selectedCategory = signal('All');

  allBooks = this.bookService.getBooks();
  
  get filteredBooks(): Book[] {
    let books = this.allBooks;
    
    if (this.selectedCategory() !== 'All') {
      books = books.filter(book => book.category === this.selectedCategory());
    }
    
    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      books = books.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
      );
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
