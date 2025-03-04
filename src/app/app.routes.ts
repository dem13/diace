import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'word-sets',
    loadComponent: () => import('./components/word-set-list/word-set-list.component').then(m => m.WordSetListComponent)
  },
  {
    path: 'word-sets/create',
    loadComponent: () => import('./components/word-set-creator/word-set-creator.component').then(m => m.WordSetCreatorComponent)
  },
  {
    path: 'word-sets/:id/edit',
    loadComponent: () => import('./components/word-set-creator/word-set-creator.component').then(m => m.WordSetCreatorComponent)
  },
  {
    path: 'study/:id',
    loadComponent: () => import('./components/study/study.component').then(m => m.StudyComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
