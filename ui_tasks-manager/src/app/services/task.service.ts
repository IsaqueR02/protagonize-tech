import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Espelho exato do seu TaskItem.cs no backend
export interface Task {
  id?: number; // Opcional pois a API gera na criação
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Ajuste a porta 5000/5001 conforme o seu console do .NET ao rodar a API
  private apiUrl = 'http://localhost:5012/api/tasks';

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(id: number, task: Task): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
