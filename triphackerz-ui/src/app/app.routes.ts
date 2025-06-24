import { Routes } from '@angular/router';
import {FilterPage} from './pages/filter-page/filter-page';
import {ResultsPage} from './pages/results-page/results-page';

export const routes: Routes = [
  { path: 'home', component: FilterPage },
  { path: 'results', component: ResultsPage },
];
