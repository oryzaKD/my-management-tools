import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL } from '../../URL'; // Adjust the path as needed

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  constructor(private http: HttpClient) { }

  getTaskList(): Observable<any> {
    return this.http.get(URL.API_TASK);
  }
}
