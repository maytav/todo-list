import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from '../../user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async generateJwt(user: UserDocument) {
    const payload = { id: user.id, username: user.username, email: user.email };
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
    });
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 12);
  }

  async comparePasswords(password: string, storedPasswordHash: string) {
    return bcrypt.compare(password, storedPasswordHash);
  }

  async verifyJwt(jwt: string) {
    return this.jwtService.verifyAsync(jwt);
  }
}
