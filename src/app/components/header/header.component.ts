import { Component, OnInit, HostListener, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WordSetService } from '../../services/word-set.service';
import { map } from 'rxjs';

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
  isDarkTheme = false;
  
  // Inject Router
  private router = inject(Router);

  constructor(private wordSetService: WordSetService) {}

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
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
    
    // You can also save theme preference to localStorage
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }

  navigateToPractice() {
    const hasSets = this.wordSetService.getWordSets().pipe(
      map(sets => sets.length > 0)
    );
    if (hasSets) {
      this.router.navigate(['/study', this.wordSetService.getRandomWordSetId()]);
    } else {
      this.router.navigate(['/word-sets/new']);
    }
  }
} 