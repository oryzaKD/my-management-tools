import { Routes } from '@angular/router';
import { MainTableComponent } from './pages/main-table/main-table.component';
import { KanbanComponent } from './pages/kanban/kanban.component';

export const routes: Routes = [
  { path: '', redirectTo: 'main-table', pathMatch: 'full' },
  { path: 'main-table', component: MainTableComponent },
  { path: 'kanban', component: KanbanComponent }
];
