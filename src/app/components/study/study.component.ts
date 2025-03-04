import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WordSet } from '../../models/word-set.model';
import { WordSetService } from '../../services/word-set.service';

enum StudyMode {
  FLASHCARD = 'flashcard',
  MULTIPLE_CHOICE = 'multiple-choice',
  TYPING = 'typing'
}

@Component({
  selector: 'app-study',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent implements OnInit {
  wordSet: WordSet | null = null;
  loading = true;
  error = false;
  
  // Study state
  currentIndex = 0;
  studyMode: StudyMode = StudyMode.FLASHCARD;
  showAnswer = false;
  userAnswer = '';
  options: string[] = [];
  
  // Progress tracking
  correctAnswers = 0;
  incorrectAnswers = 0;
  studyComplete = false;
  
  // For template access
  StudyMode = StudyMode;
  Math = Math;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private wordSetService: WordSetService
  ) {}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) {
        this.error = true;
        this.loading = false;
        return;
      }
      
      this.loadWordSet(id);
    });
  }
  
  loadWordSet(id: string): void {
    this.wordSetService.getWordSetById(id).subscribe({
      next: (wordSet) => {
        if (wordSet) {
          this.wordSet = wordSet;
          this.shuffleWords();
          this.loading = false;
          
          if (this.studyMode === StudyMode.MULTIPLE_CHOICE) {
            this.generateOptions();
          }
        } else {
          this.error = true;
          this.loading = false;
          this.router.navigate(['/word-sets']);
        }
      },
      error: (err) => {
        console.error('Error loading word set:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }
  
  shuffleWords(): void {
    if (!this.wordSet || !this.wordSet.words) return;
    
    // Fisher-Yates shuffle algorithm
    for (let i = this.wordSet.words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.wordSet.words[i], this.wordSet.words[j]] = [this.wordSet.words[j], this.wordSet.words[i]];
    }
  }
  
  changeStudyMode(mode: StudyMode): void {
    this.studyMode = mode;
    this.resetStudySession();
  }
  
  resetStudySession(): void {
    this.currentIndex = 0;
    this.showAnswer = false;
    this.userAnswer = '';
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.studyComplete = false;
    
    if (this.studyMode === StudyMode.MULTIPLE_CHOICE) {
      this.generateOptions();
    }
  }
  
  getCurrentWord() {
    return this.wordSet?.words[this.currentIndex];
  }
  
  flipCard(): void {
    if (this.studyMode === StudyMode.FLASHCARD) {
      this.showAnswer = !this.showAnswer;
    }
  }
  
  markAnswer(correct: boolean): void {
    if (correct) {
      this.correctAnswers++;
    } else {
      this.incorrectAnswers++;
    }
    
    this.nextWord();
  }
  
  checkTypedAnswer(): void {
    const currentWord = this.getCurrentWord();
    if (!currentWord) return;
    
    const isCorrect = this.userAnswer.trim().toLowerCase() === currentWord.definition.toLowerCase();
    this.markAnswer(isCorrect);
    this.userAnswer = '';
  }
  
  checkMultipleChoiceAnswer(selected: string): void {
    const currentWord = this.getCurrentWord();
    if (!currentWord) return;
    
    const isCorrect = selected === currentWord.definition;
    this.markAnswer(isCorrect);
  }
  
  nextWord(): void {
    if (!this.wordSet || !this.wordSet.words) return;
    
    if (this.currentIndex < this.wordSet.words.length - 1) {
      this.currentIndex++;
      this.showAnswer = false;
      
      if (this.studyMode === StudyMode.MULTIPLE_CHOICE) {
        this.generateOptions();
      }
    } else {
      this.studyComplete = true;
      this.saveProgress();
    }
  }
  
  generateOptions(): void {
    if (!this.wordSet || !this.wordSet.words) return;
    
    const currentWord = this.getCurrentWord();
    if (!currentWord) return;
    
    // Get the correct answer
    const correctAnswer = currentWord.definition;
    
    // Get 3 random incorrect answers
    const otherOptions = this.wordSet.words
      .filter(word => word.definition !== correctAnswer)
      .map(word => word.definition)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    // Combine and shuffle all options
    this.options = [...otherOptions, correctAnswer].sort(() => Math.random() - 0.5);
  }
  
  saveProgress(): void {
    if (!this.wordSet) return;
    
    // Save progress to the service
    this.wordSetService.saveStudyProgress(this.wordSet.id, {
      correctAnswers: this.correctAnswers,
      incorrectAnswers: this.incorrectAnswers,
      completedAt: new Date()
    });
  }
  
  restartStudy(): void {
    this.shuffleWords();
    this.resetStudySession();
  }
  
  getAccuracy(): number {
    return this.wordSet?.words?.length 
      ? Number(((this.correctAnswers / this.wordSet.words.length) * 100).toFixed(0))
      : 0;
  }

  getProgress(): number {
    return this.wordSet?.words?.length 
      ? Number(((this.currentIndex / this.wordSet.words.length) * 100).toFixed(0))
      : 0;
  }
} 