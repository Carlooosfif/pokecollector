import { Request, Response } from 'express';
import { IUserService } from '../services/interfaces/IUserService';
import { UserService } from '../services/implementations/UserService';

export class UserController {
  private userService: IUserService;

  constructor() {
    // Aplicando Single Responsibility Principle (SRP)
    this.userService = new UserService();
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const user = await this.userService.getUserById(userId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // No devolver la contraseña
      const { passwordHash, ...userWithoutPassword } = user;

      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: userWithoutPassword
      });
    } catch (error: any) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get profile'
      });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { username, email, password } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const updateData: any = {};
      if (username) updateData.username = username;
      if (email) updateData.email = email;
      if (password) updateData.password = password;

      const updatedUser = await this.userService.updateUser(userId, updateData);

      if (!updatedUser) {
        res.status(404).json({
          success: false,
          message: 'User not found or update failed'
        });
        return;
      }

      // No devolver la contraseña
      const { passwordHash, ...userWithoutPassword } = updatedUser;

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: userWithoutPassword
      });
    } catch (error: any) {
      console.error('Update profile error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update profile'
      });
    }
  }

  async getUserStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const stats = await this.userService.getUserStats(userId);

      res.status(200).json({
        success: true,
        message: 'User stats retrieved successfully',
        data: stats
      });
    } catch (error: any) {
      console.error('Get user stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user statistics'
      });
    }
  }

  async getRanking(req: Request, res: Response): Promise<void> {
    try {
      const ranking = await this.userService.getRanking();

      res.status(200).json({
        success: true,
        message: 'Ranking retrieved successfully',
        data: ranking
      });
    } catch (error: any) {
      console.error('Get ranking error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get ranking'
      });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      // Solo administradores pueden ver todos los usuarios
      if (req.user?.role !== 'ADMIN') {
        res.status(403).json({
          success: false,
          message: 'Access denied. Admin role required'
        });
        return;
      }

      const users = await this.userService.getAllUsers();

      // No devolver contraseñas
      const usersWithoutPasswords = users.map(user => {
        const { passwordHash, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: usersWithoutPasswords
      });
    } catch (error: any) {
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get users'
      });
    }
  }
}