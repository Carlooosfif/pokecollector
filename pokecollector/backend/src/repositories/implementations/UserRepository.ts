import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../interfaces/IUserRepository';
import { IUser, ICreateUser, IUpdateUser } from '../../models/interfaces/IUser';
import DatabaseConnection from '../../config/database';
import bcrypt from 'bcryptjs';

export class UserRepository implements IUserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = DatabaseConnection.getInstance().getClient();
  }

  async findById(id: string): Promise<IUser | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id }
      });
      return user as IUser | null; // Cast para evitar error de tipos
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw new Error('Failed to find user');
    }
  }

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email }
      });
      return user as IUser | null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Failed to find user');
    }
  }

  async findByUsername(username: string): Promise<IUser | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username }
      });
      return user as IUser | null;
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw new Error('Failed to find user');
    }
  }

  async create(userData: ICreateUser): Promise<IUser> {
    try {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(userData.password, saltRounds);

      const user = await this.prisma.user.create({
        data: {
          username: userData.username,
          email: userData.email,
          passwordHash,
          role: userData.role || 'COMMON'
        }
      });
      return user as IUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async update(id: string, userData: IUpdateUser): Promise<IUser | null> {
    try {
      const updateData: any = { ...userData };

      if (userData.password) {
        const saltRounds = 10;
        updateData.passwordHash = await bcrypt.hash(userData.password, saltRounds);
        delete updateData.password;
      }

      const user = await this.prisma.user.update({
        where: { id },
        data: updateData
      });
      return user as IUser;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  async findAll(): Promise<IUser[]> {
    try {
      const users = await this.prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return users as IUser[];
    } catch (error) {
      console.error('Error finding all users:', error);
      throw new Error('Failed to find users');
    }
  }
}
