import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { IAuthService } from '../interfaces/IAuthService';
import { ILoginRequest, ILoginResponse } from '../../models/interfaces/IAuth';
import { ICreateUser } from '../../models/interfaces/IUser';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import { RepositoryFactory } from '../../factories/RepositoryFactory';

export class AuthService implements IAuthService {
  private userRepository: IUserRepository;

  constructor() {
    this.userRepository = RepositoryFactory.createUserRepository();
  }

  async login(credentials: ILoginRequest): Promise<ILoginResponse> {
    try {
      const user = await this.userRepository.findByEmail(credentials.email);
      if (!user || !user.passwordHash) {
        throw new Error('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      const token = this.generateToken(user.id, user.role!);

      return {
        user: {
          id: user.id,
          username: user.username!,
          email: user.email!,
          role: user.role!
        },
        token
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Authentication failed');
    }
  }

  async register(userData: ICreateUser): Promise<ILoginResponse> {
    try {
      const existingUserByEmail = await this.userRepository.findByEmail(userData.email);
      if (existingUserByEmail) {
        throw new Error('Email already exists');
      }

      const existingUserByUsername = await this.userRepository.findByUsername(userData.username);
      if (existingUserByUsername) {
        throw new Error('Username already exists');
      }

      this.validateUserData(userData);

      const newUser = await this.userRepository.create(userData);

      const token = this.generateToken(newUser.id, newUser.role!);

      return {
        user: {
          id: newUser.id,
          username: newUser.username!,
          email: newUser.email!,
          role: newUser.role!
        },
        token
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async validateToken(token: string): Promise<{ userId: string; role: string } | null> {
    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET not configured');
      }

      const decoded = jwt.verify(token, jwtSecret) as any;
      const user = await this.userRepository.findById(decoded.userId);
      if (!user || !user.role) {
        return null;
      }

      return {
        userId: decoded.userId,
        role: decoded.role
      };
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  }

  generateToken(userId: string, role: string): string {
    const jwtSecret: Secret = process.env.JWT_SECRET || 'default_secret';
    const jwtExpiresIn = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];
    const payload = { userId, role };
    const options: SignOptions = { expiresIn: jwtExpiresIn };

    return jwt.sign(payload, jwtSecret, options);
  }

  private validateUserData(userData: ICreateUser): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    if (userData.username.length < 3 || userData.username.length > 50) {
      throw new Error('Username must be between 3 and 50 characters');
    }

    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(userData.username)) {
      throw new Error('Username can only contain letters, numbers, underscores and hyphens');
    }
  }
}

