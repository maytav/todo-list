import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserDocument } from '../../user/schemas/user.schema';

export type ConnectionDocument = Connection & Document;

@Schema()
export class Connection {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDocument',
  })
  connectedUser: UserDocument;
  @Prop({ required: true })
  socketId?: string;
}

export const ConnectionSchema = SchemaFactory.createForClass(Connection);
