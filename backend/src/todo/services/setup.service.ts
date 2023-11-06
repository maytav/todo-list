import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from '../schemas/todo.schema';

@Injectable()
export class SetupService implements OnApplicationBootstrap {
  constructor(private todoService: TodoService) {}

  async onApplicationBootstrap() {
    const items: Todo[] = [
      {
        title: 'Hrad Item',
        complexity: 'HARD',
        subTitle: 'Hard SubTitle',
        text: 'Hrad text',
        status: 'BACKLOG',
      },
      {
        title: 'Medium Item',
        complexity: 'MEDIUM',
        subTitle: 'Medium SubTitle',
        text: 'Medium text',
        status: 'TODO',
      },
      {
        title: 'Easy Item',
        complexity: 'EASY',
        subTitle: 'Easy SubTitle',
        text: 'Easy text',
        status: 'DONE',
      },
      {
        title: 'Example Item',
        complexity: 'MEDIUM',
        subTitle: 'Example SubTitle',
        text: 'Example text',
        status: 'DONE',
      },
    ];
    const todos = await this.todoService.findAll();
    if (todos.length === 0) {
      await this.todoService.saveAll(items);
    }
  }
}
