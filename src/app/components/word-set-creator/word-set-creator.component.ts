import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { WordSetService } from '../../services/word-set.service';

@Component({
  selector: 'app-word-set-creator',
  templateUrl: './word-set-creator.component.html',
  styleUrls: ['./word-set-creator.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf, NgFor]
})
export class WordSetCreatorComponent {
  wordSetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private wordSetService: WordSetService,
    private router: Router
  ) {
    this.wordSetForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', Validators.maxLength(200)],
      words: this.fb.array([
        this.createWordFormGroup()
      ])
    });
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
    if (this.words.length < 20) {
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
      const newSet = this.wordSetService.createWordSet(name, description);
      
      const words = this.wordSetForm.value.words;
      words.forEach((word: { term: string, translation: string }) => {
        this.wordSetService.addWordToSet(newSet.id, word.term, word.translation);
      });
      
      this.router.navigate(['/sets', newSet.id]);
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