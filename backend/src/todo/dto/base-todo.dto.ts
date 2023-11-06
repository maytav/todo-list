import { Complexity, Status } from '../models/todo';

export class BaseTodoDto {
  title: string;
  subTitle: string;
  text: string;
  status: Status;
  complexity: Complexity;
}
