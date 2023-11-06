import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserService } from '../user/services/user.service';
import { NextFunction, Request, Response } from 'express';
import { UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    try {
      const tokenArray: string[] = req.headers['authorization'].split(' ');
      const decodedToken = await this.authService.verifyJwt(tokenArray[0]);

      const user: UserDocument = await this.userService.findOne(
        decodedToken.id,
      );

      if (user) {
        req.user = user;
        next();
      } else {
        return new UnauthorizedException();
      }
    } catch {
      throw new UnauthorizedException();
    }
  }
}
