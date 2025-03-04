import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'flashcard_theme';
  private isDarkMode = false;
  private themeSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    this.loadThemePreference();
  }

  private loadThemePreference(): void {
    const storedPreference = localStorage.getItem(this.STORAGE_KEY);
    if (storedPreference !== null) {
      this.isDarkMode = storedPreference === 'dark';
      this.themeSubject.next(this.isDarkMode);
      this.applyTheme();
    } else {
      // Check for system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode = prefersDark;
      this.themeSubject.next(this.isDarkMode);
      this.saveThemePreference();
      this.applyTheme();
    }
  }

  private saveThemePreference(): void {
    localStorage.setItem(this.STORAGE_KEY, this.isDarkMode ? 'dark' : 'light');
  }

  private applyTheme(): void {
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  getTheme() {
    return this.themeSubject.asObservable();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.themeSubject.next(this.isDarkMode);
    this.saveThemePreference();
    this.applyTheme();
  }
} 