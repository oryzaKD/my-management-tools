import { Component, OnDestroy, OnInit } from '@angular/core';
import { PRIMENG_MODULES } from '../../shared-primeng-imports';
import { TaskService } from '../../Services/task/task.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-main-table',
  imports: [PRIMENG_MODULES, HttpClientModule],
  standalone: true,
  templateUrl: './main-table.component.html',
  styleUrls: ['./main-table.component.scss']
})
export class MainTableComponent implements OnInit, OnDestroy {
  showTable = false;

  tasks: any[] = [];

  constructor(
    // private _taskService: TaskService,
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
    // this._taskService.getTaskList().subscribe(
    //   (res: any) => {
    //     this.tasks = res.data;
    //   }
    // )
    this.http.get<any>('https://mocki.io/v1/61c56458-2b07-44e2-9ec9-c7df98ccbe9f')
      .subscribe((res: any) => {
        console.log(res); 
        this.tasks = res.data;
      });
  }
}
