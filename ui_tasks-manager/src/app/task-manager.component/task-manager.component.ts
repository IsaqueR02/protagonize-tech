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
  editingTaskId: number | null = null;
  editTaskTitle: string = '';
  editTaskDescription: string = '';

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

  startEditing(task: Task): void {
    this.editingTaskId = task.id;
    this.editTaskTitle = task.title;
    this.editTaskDescription = task.description;
  }

  cancelEdit(): void {
    this.editingTaskId = null;
    this.editTaskTitle = '';
    this.editTaskDescription = '';
  }

  saveEdit(): void {
    // Só salva se houver um ID selecionado e o título não estiver vazio
    if (this.editingTaskId && this.editTaskTitle.trim()) {
      const index = this.tasks.findIndex(t => t.id === this.editingTaskId);

      if (index !== -1) {
        this.tasks[index].title = this.editTaskTitle.trim();
        this.tasks[index].description = this.editTaskDescription.trim();
      }

      this.cancelEdit();
    }
  }

  deleteTask(taskId: number): void {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
  }
}
