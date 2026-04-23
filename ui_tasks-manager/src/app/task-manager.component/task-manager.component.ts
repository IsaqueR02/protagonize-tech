import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../services/task.service';

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

  editingTaskId: number | null | undefined = null;
  editTaskTitle: string = '';
  editTaskDescription: string = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.toggleTheme(true);
    }
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => this.tasks = data,
      error: (err) => console.error('Erro ao carregar tarefas', err)
    });
  }

  toggleTheme(forceDark?: boolean): void {
    this.isDarkMode = forceDark !== undefined ? forceDark : !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  addTask(): void {
    if (this.newTaskTitle.trim()) {
      const newTask: Task = {
        title: this.newTaskTitle.trim(),
        description: this.newTaskDescription.trim(),
        isCompleted: false
      };
      this.taskService.createTask(newTask).subscribe({
        next: (createdTask) => {
          this.tasks.push(createdTask); // Adiciona na tela com o ID real do banco
          this.newTaskTitle = '';
          this.newTaskDescription = '';
        },
        error: (err) => console.error('Erro ao criar tarefa', err)
      });
    }
  }

  toggleTaskStatus(task: Task): void {
    const updatedTask = { ...task, isCompleted: !task.isCompleted };

    this.taskService.updateTask(task.id!, updatedTask).subscribe({
      next: () => {
        task.isCompleted = !task.isCompleted;
      },
      error: (err) => console.error('Erro ao atualizar status', err)
    });
  }

  startEditing(task: Task): void {
    this.editingTaskId = task.id;
    this.editTaskTitle = task.title;
    this.editTaskDescription = task.description || '';
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

  deleteTask(taskId: number | undefined): void {
    if (!taskId) return;

    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
      },
      error: (err) => console.error('Erro ao deletar', err)
    });
  }
}
