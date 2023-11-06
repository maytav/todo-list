import { BaseTodoDto } from './base-todo.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateTodoDto extends PartialType(BaseTodoDto) {
  _id: string;
  updatedAt: Date;
}
