import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { tokenGetter } from '../../app.module';
import { Status, TodoItem } from '../models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  public todoItems$: BehaviorSubject<TodoItem[]> = new BehaviorSubject<
    TodoItem[]
  >([]);

  socket = io('http://localhost:3000/todos', {
    auth: {
      Authorization: tokenGetter(),
    },
  });

  getTodos() {
    this.socket.on('todos', (todos: TodoItem[]) => this.todoItems$.next(todos));
  }

  saveTodo(todoItem: TodoItem) {
    this.socket.emit('addTodo', todoItem);
  }

  getAddedTodo() {
    this.socket.on('addedTodo', (todo: TodoItem) => {
      this.todoItems$.next([...this.todoItems$.value, todo]);
    });
  }

  public getUpdatedTodo() {
    this.socket.on('updatedTodo', (todoItem: TodoItem) => {
      console.log('updatedTodo');
      const itemIndex = this.todoItems$.value.findIndex(
        i => i._id === todoItem._id,
      );
      const items: TodoItem[] = this.todoItems$.value;
      items[itemIndex] = todoItem;
      this.todoItems$.next(items);
    });
  }

  public updateTodo(updatedItem: TodoItem, containerId: string) {
    updatedItem.status = this.convertListIdToStatus(containerId);
    this.socket.emit('updateTodo', updatedItem);
  }

  private convertListIdToStatus(listId: string): Status {
    switch (listId) {
      case 'cdk-drop-list-0':
        return 'BACKLOG';
      case 'cdk-drop-list-1':
        return 'TODO';
      case 'cdk-drop-list-2':
        return 'DONE';
      default:
        return 'BACKLOG';
    }
  }
}
