import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { WordSetService } from '../../services/word-set.service';
import { WordSet } from '../../models/word-set.model';

@Component({
  selector: 'app-word-set-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './word-set-list.component.html',
  styleUrl: './word-set-list.component.scss'
})
export class WordSetListComponent implements OnInit {
  wordSets: WordSet[] = [];

  constructor(
    private wordSetService: WordSetService,
  ) {}

  ngOnInit(): void {
    this.wordSetService.getWordSets().subscribe(sets => {
      this.wordSets = sets;
    });
  }

  deleteSet(id: string, event: Event): void {
    event.stopPropagation();
  }
} 