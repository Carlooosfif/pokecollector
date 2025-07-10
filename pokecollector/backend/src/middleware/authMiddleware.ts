import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/implementations/AuthService';

// Extender la interfaz Request para incluir información del usuario
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

export class AuthMiddleware {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Middleware para verificar token JWT
   */
  public authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

      if (!token) {
        res.status(401).json({
          success: false,
          message: 'Access token is required'
        });
        return;
      }

      const decoded = await this.authService.validateToken(token);

      if (!decoded) {
        res.status(401).json({
          success: false,
          message: 'Invalid or expired token'
        });
        return;
      }

      // Agregar información del usuario al request
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Authentication middleware error:', error);
      res.status(401).json({
        success: false,
        message: 'Authentication failed'
      });
    }
  };

  /**
   * Middleware opcional para rutas que pueden funcionar con o sin autenticación
   */
  public optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (token) {
        const decoded = await this.authService.validateToken(token);
        if (decoded) {
          req.user = decoded;
        }
      }

      next();
    } catch (error) {
      // Si hay error, continuar sin autenticación
      next();
    }
  };
}