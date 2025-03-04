import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WordSetService } from '../../services/word-set.service';
import { WordSet } from '../../models/word-set.model';

@Component({
  selector: 'app-word-set-list',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule],
  templateUrl: './word-set-list.component.html',
  styleUrl: './word-set-list.component.scss'
})
export class WordSetListComponent implements OnInit {
  wordSets: WordSet[] = [];
  filteredWordSets: WordSet[] = [];
  
  // Search and sort controls
  searchQuery: string = '';
  sortBy: string = 'date_desc'; // Default to newest first

  constructor(
    private wordSetService: WordSetService,
  ) {}

  ngOnInit(): void {
    this.wordSetService.getWordSets().subscribe(sets => {
      this.wordSets = sets;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    // First apply search filter - only by title
    let result = this.wordSets;
    console.log(this.searchQuery);
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      result = result.filter(set => 
        set.title.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (this.sortBy) {
      case 'title_asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title_desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'date_desc':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'date_asc':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'words_desc':
        result.sort((a, b) => b.words.length - a.words.length);
        break;
      case 'words_asc':
        result.sort((a, b) => a.words.length - b.words.length);
        break;
    }
    
    this.filteredWordSets = result;
  }
  
  resetFilters(): void {
    this.searchQuery = '';
    this.sortBy = 'date_desc';
    this.applyFilters();
  }

  deleteSet(id: string, event: Event): void {
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this word set? This action cannot be undone.')) {
      this.wordSetService.deleteWordSet(id);
      this.wordSets = this.wordSets.filter(set => set.id !== id);
      this.applyFilters();
    }
  }
} 