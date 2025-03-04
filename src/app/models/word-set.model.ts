import { Word } from './word.model';

export interface StudyStats {
  date: Date;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
}

export interface WordSet {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  lastStudied?: Date;
  studyStats?: StudyStats[];
  words: Word[];
} 