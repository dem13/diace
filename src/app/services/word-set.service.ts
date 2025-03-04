import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { WordSet } from '../models/word-set.model';
import { Word } from '../models/word.model';

@Injectable({
  providedIn: 'root'
})
export class WordSetService {
  private readonly STORAGE_KEY = 'flashcard_word_sets';
  private wordSets: WordSet[] = [];
  private wordSetsSubject = new BehaviorSubject<WordSet[]>([]);

  constructor() {
    this.loadFromLocalStorage();
    
    // Add sample data if no word sets exist
    if (this.wordSets.length === 0) {
      this.addSampleWordSets();
    }
  }

  private loadFromLocalStorage(): void {
    const storedData = localStorage.getItem(this.STORAGE_KEY);
    if (storedData) {
      this.wordSets = JSON.parse(storedData);
      this.wordSetsSubject.next([...this.wordSets]);
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.wordSets));
    this.wordSetsSubject.next([...this.wordSets]);
  }

  getWordSets(): Observable<WordSet[]> {
    return this.wordSetsSubject.asObservable();
  }

  getWordSetById(id: string): Observable<WordSet | null> {
    const wordSet = this.wordSets.find(set => set.id === id);
    if (wordSet) {
      return of(wordSet);
    } else {
      return of(null);
    }
  }

  createWordSet(name: string, description?: string): WordSet {
    const newSet: WordSet = {
      id: Date.now().toString(),
      title: name,
      description: description || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      words: []
    };

    this.wordSets.push(newSet);
    this.saveToLocalStorage();
    return newSet;
  }

  updateWordSet(updatedSet: WordSet): void {
    const index = this.wordSets.findIndex(set => set.id === updatedSet.id);
    if (index !== -1) {
      updatedSet.updatedAt = new Date();
      this.wordSets[index] = updatedSet;
      this.saveToLocalStorage();
    }
  }

  deleteWordSet(id: string): void {
    this.wordSets = this.wordSets.filter(set => set.id !== id);
    this.saveToLocalStorage();
  }

  addWordToSet(setId: string, term: string, definition: string): void {
    const set = this.wordSets.find(s => s.id === setId);
    if (set) {
      const newWord: Word = {
        id: Date.now().toString(),
        term,
        definition
      };
      
      set.words.push(newWord);
      set.updatedAt = new Date();
      this.saveToLocalStorage();
    }
  }

  updateWord(setId: string, updatedWord: Word): void {
    const set = this.wordSets.find(s => s.id === setId);
    if (set) {
      const wordIndex = set.words.findIndex(word => word.id === updatedWord.id);
      if (wordIndex !== -1) {
        set.words[wordIndex] = updatedWord;
        set.updatedAt = new Date();
        this.saveToLocalStorage();
      }
    }
  }

  deleteWord(setId: string, wordId: string): void {
    const set = this.wordSets.find(s => s.id === setId);
    if (set) {
      set.words = set.words.filter(word => word.id !== wordId);
      set.updatedAt = new Date();
      this.saveToLocalStorage();
    }
  }

  shuffleWords(setId: string): void {
    const set = this.wordSets.find(s => s.id === setId);
    if (set && set.words.length > 1) {
      // Fisher-Yates shuffle algorithm
      for (let i = set.words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [set.words[i], set.words[j]] = [set.words[j], set.words[i]];
      }
      this.saveToLocalStorage();
    }
  }

  saveStudyProgress(setId: string, progress: { 
    correctAnswers: number, 
    incorrectAnswers: number, 
    completedAt: Date 
  }): void {
    const set = this.wordSets.find(s => s.id === setId);
    if (set) {
      set.lastStudied = progress.completedAt;
      set.studyStats = set.studyStats || [];
      set.studyStats.push({
        date: progress.completedAt,
        correctAnswers: progress.correctAnswers,
        incorrectAnswers: progress.incorrectAnswers,
        accuracy: Math.round((progress.correctAnswers / (progress.correctAnswers + progress.incorrectAnswers)) * 100)
      });
      this.saveToLocalStorage();
    }
  }

  private addSampleWordSets(): void {
    const sampleSets = [
      {
        title: 'Common English Phrasal Verbs',
        description: 'Essential phrasal verbs for everyday English conversation',
        words: [
          { term: 'break down', definition: 'stop functioning' },
          { term: 'bring up', definition: 'mention or introduce a subject' },
          { term: 'carry on', definition: 'continue doing something' },
          { term: 'come across', definition: 'find something by chance' },
          { term: 'figure out', definition: 'understand or solve' }
        ]
      },
      {
        title: 'Basic Spanish Vocabulary',
        description: 'Essential Spanish words for beginners',
        words: [
          { term: 'hola', definition: 'hello' },
          { term: 'adiós', definition: 'goodbye' },
          { term: 'por favor', definition: 'please' },
          { term: 'gracias', definition: 'thank you' },
          { term: 'sí', definition: 'yes' },
          { term: 'no', definition: 'no' }
        ]
      }
    ];
    
    sampleSets.forEach(set => {
      const newSet = this.createWordSet(set.title, set.description);
      set.words.forEach(word => {
        this.addWordToSet(newSet.id, word.term, word.definition);
      });
    });
  }
} 