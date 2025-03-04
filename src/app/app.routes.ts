import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { WordSetListComponent } from './components/word-set-list/word-set-list.component';
import { WordSetCreatorComponent } from './components/word-set-creator/word-set-creator.component';
import { StudyComponent } from './components/study/study.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'word-sets',
    component: WordSetListComponent
  },
  {
    path: 'word-sets/create',
    component: WordSetCreatorComponent
  },
  {
    path: 'word-sets/:id',
    component: WordSetCreatorComponent
  },
  {
    path: 'study/:id',
    component: StudyComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
