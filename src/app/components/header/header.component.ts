import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private bookService = inject(BookService);
  private authService = inject(AuthService);
  
  cartCount = computed(() => this.bookService.getCartCount());
  currentUser = computed(() => this.authService.currentUser());
  isAuthenticated = computed(() => this.authService.isAuthenticated());
  showUserMenu = signal(false);

  toggleUserMenu(): void {
    this.showUserMenu.update(value => !value);
  }

  logout(): void {
    this.showUserMenu.set(false);
    this.authService.logout();
  }
}

// Made with Bob
