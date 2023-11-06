import { UserDocument } from '../../user/schemas/user.schema';

export class BaseConnectionDto {
  socketId: string;
  connectedUser: UserDocument;
}
