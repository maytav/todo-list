import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ConnectionDocument } from '../../todo/schemas/connection.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true, lowercase: true })
  username?: string;
  @Prop({
    unique: true,
    lowercase: true,
  })
  email: string;
  @Prop({ select: false })
  password: string;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Connection' }] })
  connections: ConnectionDocument[];
}

export const UserSchema = SchemaFactory.createForClass(User);
