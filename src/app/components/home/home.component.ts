import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WordSetService } from '../../services/word-set.service';
import { WordSet } from '../../models/word-set.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  recentSets: WordSet[] = [];

  constructor(private wordSetService: WordSetService) {}

  ngOnInit(): void {
    this.loadRecentSets();
  }

  loadRecentSets(): void {
    this.wordSetService.getWordSets().subscribe(sets => {
      // Get the most recent 3 sets
      this.recentSets = [...sets]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 3);
    });
  }
} 