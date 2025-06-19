import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { PRIMENG_MODULES } from '../../shared-primeng-imports';

@Component({
  selector: 'app-main-table',
  imports: [PRIMENG_MODULES],
  standalone: true,
  templateUrl: './main-table.component.html',
  styleUrls: ['./main-table.component.scss']
})
export class MainTableComponent implements OnInit, OnDestroy {
  showTable = false;

  tasks = [
    {
      name: 'New Task',
      developerAvatar: '',
      status: 'Waiting for review',
      statusColor: 'info',
      priority: 'Medium',
      priorityColor: 'warning',
      type: 'Feature Enhance',
      typeColor: 'info',
      date: '',
      estimatedSP: 0,
      actualSP: 0
    },
    {
      name: 'New task',
      developerAvatar: '',
      status: 'In Progress',
      statusColor: 'warning',
      priority: 'Best Effort',
      priorityColor: 'success',
      type: 'Feature Enhance',
      typeColor: 'info',
      date: '',
      estimatedSP: 0,
      actualSP: 0
    },
    {
      name: 'New Task',
      developerAvatar: '',
      status: '',
      statusColor: '',
      priority: '',
      priorityColor: '',
      type: '',
      typeColor: '',
      date: '',
      estimatedSP: 0,
      actualSP: 0
    },
    {
      name: 'Committed Feature',
      developerAvatar: '',
      status: 'Ready to start',
      statusColor: 'success',
      priority: 'High',
      priorityColor: 'danger',
      type: 'Other',
      typeColor: 'secondary',
      date: '',
      estimatedSP: 2,
      actualSP: 1.5
    }
  ];

  constructor() {
    console.log('MainTableComponent constructor');
  }

  ngOnInit(): void {
    console.log('MainTableComponent ngOnInit');
  }

  ngOnDestroy(): void {
    console.log('MainTableComponent ngOnDestroy');
  }

  getEstimatedSPSum() {
    return this.tasks.reduce((sum, task) => sum + (task.estimatedSP || 0), 0);
  }

  getActualSPSum() {
    return this.tasks.reduce((sum, task) => sum + (task.actualSP || 0), 0);
  }
}
