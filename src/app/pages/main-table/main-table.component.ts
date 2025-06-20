import { Component, OnDestroy, OnInit } from '@angular/core';
import { PRIMENG_MODULES } from '../../shared-primeng-imports';
import { TaskService } from '../../Services/task/task.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Type {
  name: string
}

export interface Task {
  title: string;
  developerAvatar: string;
  status: string;
  priority: string;
  type: string;
  date: string;
  estimatedSP: number;
  actualSP: number;
}

@Component({
  selector: 'app-main-table',
  imports: [PRIMENG_MODULES, HttpClientModule, FormsModule],
  standalone: true,
  templateUrl: './main-table.component.html',
  styleUrls: ['./main-table.component.scss']
})
export class MainTableComponent implements OnInit, OnDestroy {
  showTable = true;

  tasks: Task[] = [];
  newTaskRow: Task | null = null;

  statusTask: Type[] = [
    { name: 'Ready to start' },
    { name: 'In Progress' },
    { name: 'Waiting for review' },
    { name: 'Pending Deploy' },
    { name: 'Done' },
    { name: 'Stuck' }
  ];

  priorityTask: Type[] = [
    { name: 'Low' },
    { name: 'Medium' },
    { name: 'High' },
    { name: 'Critical' },
    { name: 'Best Effort' }
  ];

  typeTask: Type[] = [
    { name: 'Feature Enhancements' },
    { name: 'Bug' },
    { name: 'Other' }
  ];

  constructor(
    private _taskService: TaskService,
    private http: HttpClient
  ) {
    console.log('MainTableComponent constructor');
  }

  ngOnInit(): void {
    this.getTaskList();
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

  getTaskList() {
    this._taskService.getTaskList().subscribe(
      (res: any) => {
        console.log(res);
        this.tasks = res.data.map((item: any) => {
          let data = {
            actualSP: item['Actual SP'],
            estimatedSP: item['Estimated SP'],
            developer: item.developer,
            priority: item.priority,
            status: item.status,
            title: item.title,
            type: item.type
          }
          return data
        });
      }
    )
    console.log(this.tasks);
  }

  onAddTaskRow() {
    if (!this.newTaskRow) {
      this.newTaskRow = {
        title: '',
        developerAvatar: '',
        status: '',
        priority: '',
        type: '',
        date: '',
        estimatedSP: 0,
        actualSP: 0
      };
    }
  }

  onSaveNewTask() {
    if (this.newTaskRow) {
      this.tasks = [this.newTaskRow, ...this.tasks];
      this.newTaskRow = null;
    }
  }

  onCancelNewTask() {
    this.newTaskRow = null;
  }

  getSeverityStatus(status: string): string {
    switch (status) {
      case 'Ready to start':
        return 'tag-inprogress';
      case 'In Progress':
        return 'tag-inprogress';
      case 'Waiting for review':
        return 'danger';
      case 'Pending Deploy':
        return 'tag-blocked';
      case 'Done':
        return 'tag-done';
      case 'Stuck':
        return 'tag-blocked';
      default:
        return 'tag-default';
    }
  }

  getSeverityPriority(priority: string): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
    switch (priority) {
      case 'Low':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'High':
        return 'danger';
      case 'Critical':
        return 'danger';
      case 'Best Effort':
        return 'secondary';
      default:
        return 'secondary';
    }
  }

  getSeverityType(type: string): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
    switch (type) {
      case 'Feature Enhancements':
        return 'info';
      case 'Bug':
        return 'info';
      case 'Other':
        return 'secondary';
      default:
        return 'secondary';
    }
  }
}
