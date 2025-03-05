import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { WordSetService } from '../../services/word-set.service';

@Component({
  selector: 'app-word-set-creator',
  templateUrl: './word-set-creator.component.html',
  styleUrls: ['./word-set-creator.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf, NgFor]
})
export class WordSetCreatorComponent implements OnInit {
  wordSetForm: FormGroup;
  editMode = false;
  wordSetId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private wordSetService: WordSetService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.wordSetForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', Validators.maxLength(200)],
      words: this.fb.array([
        this.createWordFormGroup()
      ])
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.wordSetId = params.get('id');
      
      if (this.wordSetId) {
        this.editMode = true;
        this.loadWordSet(this.wordSetId);
      }
    });
  }

  loadWordSet(id: string): void {
    const wordSet = this.wordSetService.getWordSetByIdDirect(id);
    
    if (wordSet) {
      // Clear the default empty word form
      while (this.words.length) {
        this.words.removeAt(0);
      }
      
      // Set the basic form values
      this.wordSetForm.patchValue({
        name: wordSet.title,
        description: wordSet.description
      });
      
      // Add each word to the form array
      const words = this.wordSetService.getWordsForSet(id);
      words.forEach(word => {
        this.words.push(
          this.fb.group({
            term: [word.term, [Validators.required, Validators.maxLength(100)]],
            translation: [word.definition, [Validators.required, Validators.maxLength(100)]]
          })
        );
      });
      
      // If no words were found, add an empty word form
      if (this.words.length === 0) {
        this.addWord();
      }
    }
  }

  get words(): FormArray {
    return this.wordSetForm.get('words') as FormArray;
  }

  createWordFormGroup(): FormGroup {
    return this.fb.group({
      term: ['', [Validators.required, Validators.maxLength(100)]],
      translation: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  addWord(): void {
    if (this.words.length < 200) {
      this.words.push(this.createWordFormGroup());
    }
  }

  removeWord(index: number): void {
    if (this.words.length > 1) {
      this.words.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.wordSetForm.valid) {
      const { name, description } = this.wordSetForm.value;
      
      if (this.editMode && this.wordSetId) {
        // Update existing word set
        this.wordSetService.updateWordSet(this.wordSetId, name, description);
        
        // Remove all existing words and add the current ones
        this.wordSetService.clearWordsFromSet(this.wordSetId);
        
        const words = this.wordSetForm.value.words;
        words.forEach((word: { term: string, translation: string }) => {
          this.wordSetService.addWordToSet(this.wordSetId!, word.term, word.translation);
        });
        
        this.router.navigate(['/word-sets']);
      } else {
        // Create new word set (existing functionality)
        const newSet = this.wordSetService.createWordSet(name, description);
        
        const words = this.wordSetForm.value.words;
        words.forEach((word: { term: string, translation: string }) => {
          this.wordSetService.addWordToSet(newSet.id, word.term, word.translation);
        });
        
        this.router.navigate(['/word-sets']);
      }
    } else {
      // Mark all fields as touched to trigger validation messages
      this.markFormGroupTouched(this.wordSetForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(c => {
          if (c instanceof FormGroup) {
            this.markFormGroupTouched(c);
          } else {
            c.markAsTouched();
          }
        });
      }
    });
  }
} 
