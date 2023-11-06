import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UserService } from '../../user/services/user.service';
import { AuthService } from '../../auth/services/auth.service';
import { Server, Socket } from 'socket.io';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { UserDocument } from '../../user/schemas/user.schema';
import { TodoService } from '../services/todo.service';
import { ConnectionService } from '../services/connection.service';
import { Todo } from '../schemas/todo.schema';
import { Connection } from '../schemas/connection.schema';
import { UpdateTodoDto } from '../dto/update-todo.dto';

@WebSocketGateway({
  namespace: 'todos',
  cors: { origin: ['http://localhost:3000', 'http://localhost:4200'] },
})
export class TodoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private connectionService: ConnectionService,
    private todoService: TodoService,
  ) {}

  async getUser(socket: Socket): Promise<UserDocument> {
    const decodedToken = await this.authService.verifyJwt(
      socket.handshake.auth.Authorization,
    );
    return await this.userService.findOne(decodedToken.id);
  }

  async handleConnection(socket: Socket) {
    try {
      const user: UserDocument = await this.getUser(socket);

      if (!user) {
        return this.disconnect(socket);
      } else {
        await this.connectionService.create({
          socketId: socket.id,
          connectedUser: user,
        });
        const todos = await this.todoService.findAll();
        return this.server.to(socket.id).emit('todos', todos);
      }
    } catch (e) {
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    await this.connectionService.deleteBySocketId(socket.id);
    socket.disconnect();
  }

  @SubscribeMessage('addTodo')
  async onAddTodo(socket: Socket, todo: Todo) {
    try {
      const user: UserDocument = await this.getUser(socket);
      if (user) todo.createdBy = user;
    } catch (e) {
      Logger.log('disconnect user', e);
    }

    const createdTodoItem: Todo = await this.todoService.create(todo);
    const connections: Connection[] = await this.connectionService.findAll();
    for (const connection of connections) {
      this.server.to(connection.socketId).emit('addedTodo', createdTodoItem);
    }
  }

  @SubscribeMessage('updateTodo')
  async onUpdateTodo(socket: Socket, todo: UpdateTodoDto) {
    const updatedTodoItem: Todo = await this.todoService.update(todo._id, todo);
    const connections: Connection[] = await this.connectionService.findAll();
    for (const connection of connections) {
      this.server.to(connection.socketId).emit('updatedTodo', updatedTodoItem);
    }
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }
}
