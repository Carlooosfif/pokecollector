import { ILoginRequest, ILoginResponse } from '../../models/interfaces/IAuth';
import { ICreateUser } from '../../models/interfaces/IUser';

export interface IAuthService {
  login(credentials: ILoginRequest): Promise<ILoginResponse>;
  register(userData: ICreateUser): Promise<ILoginResponse>;
  validateToken(token: string): Promise<{ userId: string; role: string } | null>;
  generateToken(userId: string, role: string): string;
}