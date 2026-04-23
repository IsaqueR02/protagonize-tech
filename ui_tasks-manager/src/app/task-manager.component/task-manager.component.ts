import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../services/task.service';
import { ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService
  ) {}

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
        this.toastr.error('Não foi possível conectar ao servidor.');
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
        isCompleted: false
      };
      this.taskService.createTask(newTask).subscribe({
        next: (createdTask) => {
          this.tasks.push(createdTask);
          setTimeout(() => {
            this.newTaskTitle = '';
            this.newTaskDescription = '';
          })
          this.toastr.success('Tarefa adicionada com sucesso!');
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Falha ao salvar a tarefa. Tente novamente.');
        }
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
            taskToUpdate.title = updatedTask.title;
            taskToUpdate.description = updatedTask.description;
            setTimeout(() => {
              this.cancelEdit();
            });
            this.toastr.success('Tarefa atualizada com sucesso!');
          },
          error: (err) => {
          console.error(err);
          this.toastr.error('Falha ao editar a tarefa. Tente novamente.');
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
      },
      error: (err) => {
          console.error(err);
          this.toastr.error('Falha ao deletar a tarefa. Tente novamente.', 'Ops!');
        }
    });
  }
}
