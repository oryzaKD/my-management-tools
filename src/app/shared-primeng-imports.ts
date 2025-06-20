import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { RouterOutlet, RouterModule, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MainTableComponent } from './pages/main-table/main-table.component';
import { HttpClientModule } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from 'primeng/dragdrop';

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
    HttpClientModule,
    DropdownModule,
    CalendarModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    MultiSelectModule,
    TooltipModule,
    DialogModule,
    FormsModule,
    DragDropModule
];  
