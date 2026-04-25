import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';


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

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  private showNotification(message: string, type: 'success' | 'warning' | 'error'): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: [`snackbar-${type}`]
    });
  }

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
      error: (err) => {
        console.error(err);
        this.showNotification('Erro na conexão com a API.', 'error');
      }
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
        status: 'Pendente'
      };
      this.taskService.createTask(newTask).subscribe({
        next: (createdTask) => {
          this.tasks.push(...this.tasks, createdTask);

          this.newTaskTitle = '';
          this.newTaskDescription = '';

          this.showNotification('Tarefa adicionada com sucesso!', 'success');
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.showNotification('Falha ao adicionar a tarefa.', 'warning');
        }
      });
    }
  }

  toggleTaskStatus(task: Task): void {

    const novoStatus: "Pendente" | "Concluída" = task.status === 'Pendente' ? 'Concluída' : 'Pendente';
    const updatedTask = { ...task, status: novoStatus };

    this.taskService.updateTask(task.id!, updatedTask).subscribe({
        next: () => {
          this.tasks = this.tasks.map(t => t.id === task.id ? { ...t, status: novoStatus } : t);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.showNotification('Falha ao atualizar o status.', 'warning');
        }
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
    if (this.editingTaskId && this.editTaskTitle.trim()) {
      const taskToUpdate = this.tasks.find(t => t.id === this.editingTaskId);

      if (taskToUpdate) {
        const updatedTask = {
          ...taskToUpdate,
          title: this.editTaskTitle.trim(),
          description: this.editTaskDescription.trim()
        };

        this.taskService.updateTask(this.editingTaskId, updatedTask).subscribe({
          next: () => {
            this.tasks = this.tasks.map(t =>
              t.id === this.editingTaskId
                ? { ...t, title: updatedTask.title, description: updatedTask.description }
                : t
            );

            this.cancelEdit();
            this.showNotification('Tarefa atualizada com sucesso!', 'success');
            this.cdr.detectChanges();
          },
          error: (err) => {
          console.error(err);
          this.showNotification('Falha ao editar a tarefa.', 'warning');
        }
        });
      }
    }
  }

  deleteTask(taskId: number | undefined): void {
    if (!taskId) return;

    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.showNotification('Tarefa removida.', 'success');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.showNotification('Erro ao comunicar com a API.', 'error');
      }
    });
  }
}
