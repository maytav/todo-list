import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { AuthService } from '../../auth/services/auth.service';
import { LoginUserDto } from '../dto/login-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
    private authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const emailExists = await this.emailExists(createUserDto.email);
    const usernameExists = await this.usernameExists(createUserDto.username);
    if (emailExists === false && usernameExists === false) {
      createUserDto.password = await this.authService.hashPassword(
        createUserDto.password,
      );
      return await new this.model({
        ...createUserDto,
        createdAt: new Date(),
      }).save();
    } else {
      throw new HttpException(
        'Email or Username already taken',
        HttpStatus.CONFLICT,
      );
    }
  }

  async findOne(id: string): Promise<UserDocument> {
    return await this.model.findById(id).exec();
  }

  async findAll() {
    return await this.model.find().exec();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    // Logger.debug(email);
    return await this.model
      .findOne({ email })
      .select('id username email password')
      .exec();
  }

  async login(loginUserDto: LoginUserDto): Promise<string> {
    const user: UserDocument = await this.findByEmail(loginUserDto.email);
    // Logger.debug(user);
    if (user) {
      const passwordMatching = await this.authService.comparePasswords(
        loginUserDto.password,
        user.password,
      );
      if (passwordMatching === true) {
        const payload: UserDocument = await this.findOne(user._id);
        return this.authService.generateJwt(payload);
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  private async emailExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return !!user;
  }

  private async usernameExists(username: string): Promise<boolean> {
    const user = await this.model.findOne({ username }).exec();
    return !!user;
  }
}
