import { Component, inject, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { TodoItem } from '../../models';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateTodoComponent } from '../create-todo/create-todo.component';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  backlogItems: TodoItem[] = [];
  todoItems: TodoItem[] = [];
  doneItems: TodoItem[] = [];
  createTodoComponentDialogRef: MatDialogRef<CreateTodoComponent> | undefined;
  private todoService = inject(TodoService);
  items$: Observable<TodoItem[]> = this.todoService.todoItems$;
  private matDialog: MatDialog = inject(MatDialog);

  constructor() {}

  ngOnInit() {
    this.todoService.getTodos();
    this.todoService.getAddedTodo();
    this.todoService.getUpdatedTodo();

    this.items$
      .pipe(
        tap(items => {
          this.backlogItems = items.filter(item => item.status === 'BACKLOG');
          this.todoItems = items.filter(item => item.status === 'TODO');
          this.doneItems = items.filter(item => item.status === 'DONE');
        }),
      )
      .subscribe();
  }

  drop(event: CdkDragDrop<TodoItem[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    const updatedItem: TodoItem = event.container.data[event.currentIndex];
    this.todoService.updateTodo(updatedItem, event.container.id);
  }

  onShowCreateTodoDialog() {
    this.createTodoComponentDialogRef = this.matDialog.open(
      CreateTodoComponent,
      {
        minHeight: '400px',
        minWidth: '300px',
      },
    );
  }
}
