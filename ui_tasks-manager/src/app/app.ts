import { Component, signal } from '@angular/core';
import { TaskManagerComponent } from './task-manager.component/task-manager.component';

@Component({
  selector: 'app-root',
  imports: [TaskManagerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('task-manager');
}
