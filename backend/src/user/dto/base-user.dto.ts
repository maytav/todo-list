import { IsEmail, IsNotEmpty } from 'class-validator';

export class BaseUserDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}
