import { Component, OnInit } from '@angular/core';
import { PRIMENG_MODULES } from '../../shared-primeng-imports';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../Services/task/task.service';

interface Type {
  name: string
}

export interface Task {
  title: string;
  task: {
    developer: string[] | { name: string }[];
    title: string;
    date: string;
    tags: {
      type: string;
      priority: string;
      actualSP: number;
      estimatedSP: number;
    };
  }[];
}

@Component({
  selector: 'app-kanban',
  imports: [PRIMENG_MODULES, FormsModule],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss'
})
export class KanbanComponent implements OnInit {
  newTaskRow: any = {
    title: '',
    developer: [],
    status: '',
    priority: '',
    type: '',
    date: '',
    estimatedSP: 0,
    actualSP: 0
  };
  tasks: Task[] = [];
  filteredTasks: Task[] = [];

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

  selectedDeveloper: string | null = null;
  draggedTask: any = null;
  searchTerm: string = '';
  sortOrder: 'asc' | 'desc' | 'none' = 'none';

  addTaskDialog: boolean = false;

  constructor(private _taskService: TaskService) {
  }

  ngOnInit(): void {
    this.getTaskList();
  }

  getTaskList() {
    this._taskService.getTaskList().subscribe(
      (res: any) => {
        console.log(res);
        
        // Group tasks by status
        const groupedTasks: { [status: string]: any[] } = {};
        
        res.data.forEach((item: any) => {
          const cleaned = item.developer.replace(/"/g, '');
          const taskData = {
            developer: cleaned.split(',').map((name: string) => name.trim()),
            title: item.title,
            tags: {
              type: item.type,
              priority: item.priority,
              actualSP: item['Actual SP'],
              estimatedSP: item['Estimated SP']
            }
          };
          
          // Group by status
          if (!groupedTasks[item.status]) {
            groupedTasks[item.status] = [];
          }
          groupedTasks[item.status].push(taskData);
        });
        
        // Convert grouped tasks to the expected Task[] format
        this.tasks = Object.keys(groupedTasks).map(status => ({
          title: status,
          task: groupedTasks[status]
        }));
        
        this.applyFilters();
      }
    )

    console.log(this.tasks);
  }

  getStatusBackgroundColor(status: string): string {
    switch (status) {
      case 'Ready to start':
        return '#47d582'; // Green
      case 'In Progress':
        return '#f1c40f'; // Yellow
      case 'Waiting for review':
        return '#3ddde3'; // Light Blue
      case 'Pending Deploy':
        return '#2768ae'; // Blue
      case 'Done':
        return '#27ae60'; // Dark Green
      case 'Stuck':
        return '#e74c3c'; // Red
      default:
        return '#8d979d'; // Gray
    }
  }

  showDialog() {
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
    this.addTaskDialog = true;
  }

  handleCloseDialog() {
    this.addTaskDialog = false;
  }

  onSearchFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value.toLowerCase();
    this.applyFilters();
  }

  onDeveloperFilterChange() {
    this.applyFilters();
  }

  clearSearch() {
    this.searchTerm = '';
    this.applyFilters();
  }

  toggleSort() {
    // Cycle through sort states: none -> asc -> desc -> none
    switch (this.sortOrder) {
      case 'none': this.sortOrder = 'asc'; break;
      case 'asc': this.sortOrder = 'desc'; break;
      case 'desc': this.sortOrder = 'none'; break;
    }
    this.applyFilters();
  }

  getSortIcon(): string {
    switch (this.sortOrder) {
      case 'asc': return 'pi pi-sort-alpha-up';    // A-Z icon
      case 'desc': return 'pi pi-sort-alpha-down';  // Z-A icon
      default: return 'pi pi-sort-alt';             // Default sort icon
    }
  }

  getSortLabel(): string {
    switch (this.sortOrder) {
      case 'asc': return 'Sort A-Z';
      case 'desc': return 'Sort Z-A';
      default: return 'Sort';
    }
  }

  onSaveNewTask() {
    // Validate required fields
    if (!this.newTaskRow.title || !this.newTaskRow.status || !this.newTaskRow.developer || this.newTaskRow.developer.length === 0) {
      console.error('Please fill in all required fields');
      // You might want to show a toast message here
      return;
    }

    // Create task object in the expected format
    const newTask = {
      developer: this.newTaskRow.developer.map((dev: any) => typeof dev === 'string' ? dev : dev.name),
      title: this.newTaskRow.title,
      date: this.newTaskRow.date || new Date().toISOString().split('T')[0], // Use provided date or current date
      tags: {
        type: this.newTaskRow.type,
        priority: this.newTaskRow.priority,
        actualSP: this.newTaskRow.actualSP || 0,
        estimatedSP: this.newTaskRow.estimatedSP || 0
      }
    };

    // Find the target status group in the main tasks array
    let targetStatusGroup = this.tasks.find(statusGroup => statusGroup.title === this.newTaskRow.status);
    
    // If the status group doesn't exist, create it
    if (!targetStatusGroup) {
      targetStatusGroup = {
        title: this.newTaskRow.status,
        task: []
      };
      this.tasks.push(targetStatusGroup);
    }

    // Add the new task to the status group
    targetStatusGroup.task.push(newTask);

    // Update filtered tasks as well
    this.applyFilters();

    // Close the dialog
    this.addTaskDialog = false;

    // Reset the form
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

  onCancelNewTask() {
    this.addTaskDialog = false;
  }

  applyFilters() {
    this.filteredTasks = this.tasks.map(statusGroup => {
      let filteredTasks = statusGroup.task.filter(task => {
        // Check developer filter
        let matchesDeveloper = true;
        if (this.selectedDeveloper) {
          if (Array.isArray(task.developer)) {
            matchesDeveloper = task.developer.some((dev: any) => 
              typeof dev === 'string' ? dev === this.selectedDeveloper : dev.name === this.selectedDeveloper
            );
          } else {
            matchesDeveloper = false;
          }
        }

        // Check search filter (by title)
        let matchesSearch = true;
        if (this.searchTerm && this.searchTerm.trim() !== '') {
          matchesSearch = task.title.toLowerCase().includes(this.searchTerm);
        }

        return matchesDeveloper && matchesSearch;
      });

      // Apply sorting by title
      if (this.sortOrder !== 'none') {
        filteredTasks = filteredTasks.sort((a, b) => {
          const titleA = a.title.toLowerCase();
          const titleB = b.title.toLowerCase();
          
          if (this.sortOrder === 'asc') {
            return titleA.localeCompare(titleB);
          } else {
            return titleB.localeCompare(titleA);
          }
        });
      }
      
      return {
        title: statusGroup.title,
        task: filteredTasks
      };
    }).filter(statusGroup => statusGroup.task.length > 0); // Only show status groups that have tasks
    
    console.log('Filtered and sorted tasks:', this.filteredTasks);
  }

  applyDeveloperFilter() {
    this.applyFilters();
  }

  getDeveloperTooltip(developers: string[] | { name: string }[]): string {
    return developers.map(d => typeof d === 'string' ? d : d.name).join(', ');
  }

  onTaskDragStart(event: any, task: any, sourceStatus: string, sourceIndex: number) {
    this.draggedTask = { task, sourceStatus, sourceIndex };
    console.log('Drag started:', this.draggedTask);
  }

  onTaskDragEnd(event: any) {
    this.draggedTask = null;
    console.log('Drag ended');
  }

  onTaskDrop(event: any, targetStatus: string) {
    if (this.draggedTask && this.draggedTask.sourceStatus !== targetStatus) {
      // Remove task from source status
      const sourceStatusGroup = this.filteredTasks.find(s => s.title === this.draggedTask.sourceStatus);
      if (sourceStatusGroup) {
        const taskIndex = sourceStatusGroup.task.findIndex(t => t === this.draggedTask.task);
        if (taskIndex > -1) {
          sourceStatusGroup.task.splice(taskIndex, 1);
        }
      }

      // Add task to target status
      const targetStatusGroup = this.filteredTasks.find(s => s.title === targetStatus);
      if (targetStatusGroup) {
        targetStatusGroup.task.push(this.draggedTask.task);
      }

      // Also update the main tasks array
      const mainSourceGroup = this.tasks.find(s => s.title === this.draggedTask.sourceStatus);
      const mainTargetGroup = this.tasks.find(s => s.title === targetStatus);
      
      if (mainSourceGroup) {
        const taskIndex = mainSourceGroup.task.findIndex(t => t === this.draggedTask.task);
        if (taskIndex > -1) {
          mainSourceGroup.task.splice(taskIndex, 1);
        }
      }

      if (mainTargetGroup) {
        mainTargetGroup.task.push(this.draggedTask.task);
      }

      // Here you would typically make an API call to update the task status in the backend
      // this.updateTaskStatus(this.draggedTask.task, targetStatus);
      
      console.log(`Task "${this.draggedTask.task.title}" moved from "${this.draggedTask.sourceStatus}" to "${targetStatus}"`);
    }
    
    this.draggedTask = null;
  }

  getStatusPercentages() {
    // Calculate total number of individual tasks
    const totalTasks = this.tasks.reduce((sum, statusGroup) => sum + statusGroup.task.length, 0);
    if (!totalTasks) return [];
    
    return this.statusTask.map((status, idx) => {
      // Find the status group and count its tasks
      const statusGroup = this.tasks.find(t => t.title === status.name);
      const count = statusGroup ? statusGroup.task.length : 0;
      
      return {
        name: status.name,
        percent: Math.round((count / totalTasks) * 100),
        color: this.getStatusColorClass(status.name, idx)
      };
    }).filter(item => item.percent > 0); // Only show statuses that have tasks
  }

  getStatusColorClass(name: string, idx: number) {
    switch (name) {
      case 'Ready to start': return 'status-ready';
      case 'In Progress': return 'status-in-progress';
      case 'Waiting for review': return 'status-waiting-for-review';
      case 'Pending Deploy': return 'status-pending-deploy';
      case 'Done': return 'status-done';
      case 'Stuck': return 'status-stuck';
      default: return 'status-default';
    }
  }

}
