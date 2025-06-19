import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { RouterOutlet, RouterModule, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MainTableComponent } from './pages/main-table/main-table.component';
import { HttpClientModule } from '@angular/common/http';

export const PRIMENG_MODULES = [
    TableModule,
    ButtonModule,
    CheckboxModule,
    AvatarModule,
    TagModule,
    RouterOutlet,
    RouterModule,
    MainTableComponent,
    RouterLink,
    CommonModule,
    HttpClientModule
];
