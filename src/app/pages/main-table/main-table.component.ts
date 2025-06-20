import { Component, OnInit, ViewChild } from '@angular/core';
import { PRIMENG_MODULES } from '../../shared-primeng-imports';
import { TaskService } from '../../Services/task/task.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Table } from 'primeng/table';

interface Type {
  name: string
}

export interface Task {
  title: string;
  developer: string[] | { name: string }[];
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
  templateUrl: './main-table.component.html',
  styleUrls: ['./main-table.component.scss']
})
export class MainTableComponent implements OnInit {
  @ViewChild('dt1') dt1!: Table;
  showTable = true;

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedDeveloper: string | null = null;
  newTaskRow: Task | null = null;
  clonedTasks: { [s: string]: Task } = {};

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

  developerName: Type[] = [
    { name: 'Alice' },
    { name: 'Bob' },
    { name: 'Charlie' }
  ];

  constructor(
    private _taskService: TaskService
  ) {
    console.log('MainTableComponent constructor');
  }

  ngOnInit(): void {
    this.getTaskList();
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
          const cleaned = item.developer.replace(/"/g, '');
          console.log(typeof item.developer);
          let data = {
            actualSP: item['Actual SP'],
            estimatedSP: item['Estimated SP'],
            developer: cleaned.split(',').map((name: string) => name.trim()),
            priority: item.priority,
            status: item.status,
            title: item.title,
            type: item.type
          }
          return data
        });
        this.applyDeveloperFilter();
      }
    )

    console.log(this.tasks);
  }

  onAddTaskRow() {
    if (!this.newTaskRow) {
      this.newTaskRow = {
        title: '',
        developer: [],
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
      if (
        Array.isArray(this.newTaskRow.developer) &&
        this.newTaskRow.developer.length > 0 &&
        typeof this.newTaskRow.developer[0] === 'object'
      ) {
        this.newTaskRow.developer = this.newTaskRow.developer.map((dev: any) => dev.name);
      }
      // Add to tasks
      this.tasks = [this.newTaskRow, ...this.tasks];
      this.applyDeveloperFilter();

      this.newTaskRow = null;
    }
  }

  onCancelNewTask() {
    this.newTaskRow = null;
  }

  getSeverityStatus(status: string): string {
    switch (status) {
      case 'Ready to start':
        return 'tag-ready-to-start';
      case 'In Progress':
        return 'tag-in-progress';
      case 'Waiting for review':
        return 'tag-waiting-for-review';
      case 'Pending Deploy':
        return 'tag-pending-deploy';
      case 'Done':
        return 'tag-done';
      case 'Stuck':
        return 'tag-stuck';
      default:
        return 'tag-default';
    }
  }

  getSeverityPriority(priority: string): string {
    switch (priority) {
      case 'Low':
        return 'tag-low';
      case 'Medium':
        return 'tag-medium';
      case 'High':
        return 'tag-high';
      case 'Critical':
        return 'tag-critical';
      case 'Best Effort':
        return 'tag-best-effort';
      default:
        return 'tag-default';
    }
  }

  getSeverityType(type: string): string {
    switch (type) {
      case 'Feature Enhancements':
        return 'tag-feature-enhancements';
      case 'Bug':
        return 'tag-bug';
      case 'Other':
        return 'tag-other';
      default:
        return 'tag-default';
    }
  }

  onGlobalFilter(event: Event, dt: Table) {
    dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onRowEditInit(task: Task, index: number) {
    console.log(task);
    this.clonedTasks[task.title] = { ...task };
    // Convert developer array of strings to array of objects for p-multiselect
    if (Array.isArray(task.developer) && typeof task.developer[0] === 'string') {
      task.developer = (task.developer as string[]).map(name => ({ name }));
    }
  }

  onRowEditSave(task: Task, index: number) {
    // Convert developer array of objects back to array of strings
    if (Array.isArray(task.developer) && typeof task.developer[0] === 'object') {
      task.developer = task.developer.map((dev: any) => dev.name);
    }
    delete this.clonedTasks[task.title];
  }

  onRowEditCancel(task: Task, index: number) {
    const foundIndex = this.tasks.findIndex(t => t.title === task.title);
    if (foundIndex > -1 && this.clonedTasks[task.title]) {
      this.tasks[foundIndex] = this.clonedTasks[task.title];
      delete this.clonedTasks[task.title];
    }
  }

  getStatusPercentages() {
    const total = this.tasks.length;
    if (!total) return [];
    return this.statusTask.map((status, idx) => {
      const count = this.tasks.filter(t => t.status === status.name).length;
      return {
        name: status.name,
        percent: Math.round((count / total) * 100),
        color: this.getStatusColorClass(status.name, idx)
      };
    });
  }

  getPriorityPercentages() {
    const total = this.tasks.length;
    if (!total) return [];
    return this.priorityTask.map((priority, idx) => {
      const count = this.tasks.filter(t => t.priority === priority.name).length;
      return {
        name: priority.name,
        percent: Math.round((count / total) * 100),
        color: this.getPriorityColorClass(priority.name, idx)
      };
    });
  }

  getTypePercentages() {
    const total = this.tasks.length;
    if (!total) return [];
    return this.typeTask.map((type, idx) => {
      const count = this.tasks.filter(t => t.type === type.name).length;
      return {
        name: type.name,
        percent: Math.round((count / total) * 100),
        color: this.getTypeColorClass(type.name, idx)
      };
    });
  }

  getStatusColorClass(name: string, idx: number) {
    switch (name) {
      case 'Ready to start': return 'tag-ready-to-start';
      case 'In Progress': return 'tag-in-progress';
      case 'Waiting for review': return 'tag-waiting-for-review';
      case 'Pending Deploy': return 'tag-pending-deploy';
      case 'Done': return 'tag-done';
      case 'Stuck': return 'tag-stuck';
      default: return `tag-default`;
    }
  }

  getPriorityColorClass(name: string, idx: number) {
    switch (name) {
      case 'Low': return 'tag-low';
      case 'Medium': return 'tag-medium';
      case 'High': return 'tag-high';
      case 'Critical': return 'tag-critical';
      case 'Best Effort': return 'tag-best-effort';
      default: return `tag-default`;
    }
  }

  getTypeColorClass(name: string, idx: number) {
    switch (name) {
      case 'Feature Enhancements': return 'tag-feature-enhancements';
      case 'Bug': return 'tag-bug';
      case 'Other': return 'tag-other';
      default: return `tag-default`;
    }
  }

  onDeveloperFilterChange() {
    this.applyDeveloperFilter();
  }

  applyDeveloperFilter() {
    if (!this.selectedDeveloper) {
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter(task => {
        if (Array.isArray(task.developer)) {
          return task.developer.some(dev => typeof dev === 'string' ? dev === this.selectedDeveloper : dev.name === this.selectedDeveloper);
        }
        return false;
      });
    }
  }
}
