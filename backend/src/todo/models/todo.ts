import { UserDocument } from '../../user/schemas/user.schema';

export type Status = 'BACKLOG' | 'TODO' | 'DONE';
export type Complexity = 'EASY' | 'MEDIUM' | 'HARD';

export interface ITodo {
  createdBy: UserDocument;
  updatedBy: UserDocument;
  createdAt: Date;
  updatedAt?: Date;

  status: Status;
  title: string;
  subTitle: string;
  text: string;
  complexity: Complexity;
}
