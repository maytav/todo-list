import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Connection, ConnectionDocument } from '../schemas/connection.schema';
import { CreateConnectionDto } from '../dto/create-connection.dto';

@Injectable()
export class ConnectionService {
  constructor(
    @InjectModel(Connection.name)
    private readonly model: Model<ConnectionDocument>,
  ) {}

  async create(connection: CreateConnectionDto): Promise<Connection> {
    return await new this.model(connection).save();
  }

  async findByUserId(id: string): Promise<Connection[]> {
    return await this.model.find({ connectedUser: id }).exec();
  }

  async findAll(): Promise<Connection[]> {
    return await this.model.find().exec();
  }

  async deleteBySocketId(socketId: string): Promise<Connection> {
    return await this.model.findOneAndDelete({ socketId }).exec();
  }

  async deleteAll() {
    return await this.model.deleteMany().exec();
  }
}
