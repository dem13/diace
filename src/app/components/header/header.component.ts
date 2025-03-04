import { Component, OnInit, HostListener, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() scrolled = new EventEmitter<boolean>();
  isScrolled = false;
  isMenuOpen = false;
  isSearchActive = false;
  isUserMenuOpen = false;
  isDarkTheme = false;
  searchQuery = '';
  searchResults: any[] = [];
  
  // Mock user data (replace with actual auth service)
  userName = 'John Doe';
  userEmail = 'john.doe@example.com';
  userInitials = 'JD';

  constructor() {}

  ngOnInit(): void {
    // Check if dark theme is already set
    this.isDarkTheme = document.body.classList.contains('dark-theme');
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const wasScrolled = this.isScrolled;
    this.isScrolled = window.scrollY > 20;
    
    // Only emit when the state changes
    if (wasScrolled !== this.isScrolled) {
      this.scrolled.emit(this.isScrolled);
    }
  }

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      // Close other menus if open
      this.isSearchActive = false;
      this.isUserMenuOpen = false;
    }
  }

  toggleSearch() {
    this.isSearchActive = !this.isSearchActive;
    if (this.isSearchActive) {
      // Close other menus if open
      this.isMenuOpen = false;
      this.isUserMenuOpen = false;
      // Focus search input
      setTimeout(() => {
        const searchInput = document.querySelector('.search-input') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }, 100);
    }
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    if (this.isUserMenuOpen) {
      // Close other menus if open
      this.isMenuOpen = false;
      this.isSearchActive = false;
    }
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
    
    // You can also save theme preference to localStorage
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }

  onSearchInput() {
    // Mock search functionality (replace with actual search service)
    if (this.searchQuery.length > 2) {
      this.searchResults = [
        { id: 1, title: 'Common English Phrasal Verbs' },
        { id: 2, title: 'TOEFL Essential Vocabulary' },
        { id: 3, title: 'Business English Terms' }
      ].filter(item => 
        item.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.searchResults = [];
    }
  }

  logout() {
    // Implement actual logout functionality
    console.log('Logging out...');
  }
} 