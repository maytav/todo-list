import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Complexity, Status } from '../models/todo';
import { UserDocument } from '../../user/schemas/user.schema';

export type TodoDocument = Todo & Document;

@Schema()
export class Todo {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserDocument' })
  createdBy?: UserDocument;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserDocument' })
  updatedBy?: UserDocument;
  @Prop({ required: true })
  createdAt?: Date;
  @Prop()
  updatedAt?: Date;
  @Prop()
  deletedAt?: Date;
  @Prop({ required: true })
  status: Status;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  subTitle: string;
  @Prop({ required: true })
  text: string;
  @Prop({ required: true })
  complexity: Complexity;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
