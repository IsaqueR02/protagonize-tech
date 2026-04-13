import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'Pendente' | 'Concluída';
  dataCreation: Date;
}

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.scss']
})
export class TaskManagerComponent implements OnInit {
  tasks: Task[] = [];
  newTaskTitle: string = '';
  newTaskDescription: string = '';
  isDarkMode: boolean = false;

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.toggleTheme(true);
    }
  }

  toggleTheme(forceDark?: boolean): void {
    this.isDarkMode = forceDark !== undefined ? forceDark : !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  addTask(): void {
    if (this.newTaskTitle.trim()) {
      this.tasks.push({
        id: Date.now(),
        title: this.newTaskTitle.trim(),
        description: this.newTaskDescription.trim(),
        status: 'Pendente',
        dataCreation: new Date()
      });
      this.newTaskTitle = '';
      this.newTaskDescription = '';
    }
  }

  toggleTaskStatus(taskId: number): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = task.status === 'Pendente' ? 'Concluída' : 'Pendente';
    }
  }

  deleteTask(taskId: number): void {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
  }
}