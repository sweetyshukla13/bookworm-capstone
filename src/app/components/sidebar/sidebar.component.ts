import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  categorySelected = output<string>();

  categories = [
    { name: 'All', icon: '📚' },
    { name: 'Romance', icon: '💕' },
    { name: 'Mystery', icon: '🔍' },
    { name: 'Science Fiction', icon: '🚀' },
    { name: 'Fantasy', icon: '🧙' },
    { name: 'Historical', icon: '📜' },
    { name: 'Biography', icon: '👤' },
    { name: 'Self-help', icon: '💡' },
    { name: 'Memoir', icon: '✍️' },
    { name: 'Travel', icon: '✈️' },
    { name: 'Cooking', icon: '🍳' },
    { name: 'Children\'s', icon: '🧸' },
    { name: 'Young Adult', icon: '🎓' },
    { name: 'Comics & Graphic Novels', icon: '💥' },
    { name: 'Poetry', icon: '📝' },
    { name: 'Drama', icon: '🎭' },
    { name: 'Science', icon: '🔬' },
    { name: 'Philosophy', icon: '🤔' },
    { name: 'Religion', icon: '🕉️' },
    { name: 'Language Learning', icon: '🗣️' }
  ];

  selectedCategory = 'All';

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.categorySelected.emit(category);
  }
}

// Made with Bob
