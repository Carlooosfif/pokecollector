import { Request, Response } from 'express';
import { IAuthService } from '../services/interfaces/IAuthService';
import { AuthService } from '../services/implementations/AuthService';

export class AuthController {
  private authService: IAuthService;

  constructor() {
    // Aplicando Single Responsibility Principle (SRP)
    // El controlador solo maneja las peticiones HTTP
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, role } = req.body;

      // Validación básica
      if (!username || !email || !password) {
        res.status(400).json({
          success: false,
          message: 'Username, email and password are required'
        });
        return;
      }

      const userData = { username, email, password, role };
      const result = await this.authService.register(userData);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validación básica
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
        return;
      }

      const credentials = { email, password };
      const result = await this.authService.login(credentials);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Authentication failed'
      });
    }
  }

  async validateToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        res.status(401).json({
          success: false,
          message: 'Token is required'
        });
        return;
      }

      const result = await this.authService.validateToken(token);

      if (!result) {
        res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Token is valid',
        data: result
      });
    } catch (error: any) {
      console.error('Token validation error:', error);
      res.status(401).json({
        success: false,
        message: 'Token validation failed'
      });
    }
  }
}