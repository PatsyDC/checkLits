import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Checklist } from './pages/checklist/checklist';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'checklist', component: Checklist },
  { path: '**', redirectTo: 'login' },
];
