import { IUserService } from '../interfaces/IUserService';
import { IUser, ICreateUser, IUpdateUser } from '../../models/interfaces/IUser';
import { IRankingEntry } from '../../models/interfaces/IRanking';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import { IUserCardRepository } from '../../repositories/interfaces/IUserCardRepository';
import { RepositoryFactory } from '../../factories/RepositoryFactory';

export class UserService implements IUserService {
  private userRepository: IUserRepository;
  private userCardRepository: IUserCardRepository;

  constructor() {
    // Aplicando Dependency Inversion Principle (DIP)
    this.userRepository = RepositoryFactory.createUserRepository();
    this.userCardRepository = RepositoryFactory.createUserCardRepository();
  }

  async getUserById(id: string): Promise<IUser | null> {
    try {
      return await this.userRepository.findById(id);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw new Error('Failed to get user');
    }
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await this.userRepository.findByEmail(email);
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw new Error('Failed to get user');
    }
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    try {
      return await this.userRepository.findByUsername(username);
    } catch (error) {
      console.error('Error getting user by username:', error);
      throw new Error('Failed to get user');
    }
  }

  async createUser(userData: ICreateUser): Promise<IUser> {
    try {
      return await this.userRepository.create(userData);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: string, userData: IUpdateUser): Promise<IUser | null> {
    try {
      return await this.userRepository.update(id, userData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      return await this.userRepository.delete(id);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      console.error('Error getting all users:', error);
      throw new Error('Failed to get users');
    }
  }

  async getUserStats(userId: string): Promise<{
    totalCards: number;
    uniqueCards: number;
    completionPercentage: number;
  }> {
    try {
      return await this.userCardRepository.getUserStats(userId);
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw new Error('Failed to get user statistics');
    }
  }

  async getRanking(): Promise<IRankingEntry[]> {
    try {
      return await this.userCardRepository.getRanking();
    } catch (error) {
      console.error('Error getting ranking:', error);
      throw new Error('Failed to get ranking');
    }
  }
}