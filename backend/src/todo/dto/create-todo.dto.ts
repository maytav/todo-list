import { BaseTodoDto } from './base-todo.dto';
import { UserDocument } from '../../user/schemas/user.schema';

export class CreateTodoDto extends BaseTodoDto {
  createdBy?: UserDocument;
}
