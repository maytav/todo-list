import { Module } from '@nestjs/common';
import { TodoService } from './services/todo.service';
import { TodoController } from './todo.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './schemas/todo.schema';
import { TodoGateway } from './gateway/todo.gateway';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { Connection, ConnectionSchema } from './schemas/connection.schema';
import { ConnectionService } from './services/connection.service';
import { SetupService } from './services/setup.service';

@Module({
  providers: [TodoService, ConnectionService, TodoGateway, SetupService],
  controllers: [TodoController],
  imports: [
    MongooseModule.forFeature([
      { name: Todo.name, schema: TodoSchema },
      {
        name: Connection.name,
        schema: ConnectionSchema,
      },
    ]),

    UserModule,
    AuthModule,
  ],
  exports: [TodoService, ConnectionService, TodoGateway],
})
export class TodoModule {}
