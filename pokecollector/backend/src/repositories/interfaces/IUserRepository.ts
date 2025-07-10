import { IUser, ICreateUser, IUpdateUser } from '../../models/interfaces/IUser';

export interface IUserRepository {
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByUsername(username: string): Promise<IUser | null>;
  create(userData: ICreateUser): Promise<IUser>;
  update(id: string, userData: IUpdateUser): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<IUser[]>;
}