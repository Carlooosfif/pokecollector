import { Request, Response, NextFunction } from 'express';

export class RoleMiddleware {
  /**
   * Middleware para verificar que el usuario tenga rol de administrador
   */
  public static requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      if (req.user.role !== 'ADMIN') {
        res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization check failed'
      });
    }
  };

  /**
   * Middleware para verificar que el usuario tenga alguno de los roles especificados
   */
  public static requireRoles = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        if (!req.user) {
          res.status(401).json({
            success: false,
            message: 'Authentication required'
          });
          return;
        }

        if (!roles.includes(req.user.role)) {
          res.status(403).json({
            success: false,
            message: `Access denied. Required roles: ${roles.join(', ')}`
          });
          return;
        }

        next();
      } catch (error) {
        console.error('Role middleware error:', error);
        res.status(500).json({
          success: false,
          message: 'Authorization check failed'
        });
      }
    };
  };

  /**
   * Middleware para verificar que el usuario sea el propietario del recurso o admin
   */
  public static requireOwnershipOrAdmin = (userIdParam: string = 'userId') => {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        if (!req.user) {
          res.status(401).json({
            success: false,
            message: 'Authentication required'
          });
          return;
        }

        const resourceUserId = req.params[userIdParam];
        const currentUserId = req.user.userId;
        const isAdmin = req.user.role === 'ADMIN';

        if (!isAdmin && resourceUserId !== currentUserId) {
          res.status(403).json({
            success: false,
            message: 'Access denied. You can only access your own resources'
          });
          return;
        }

        next();
      } catch (error) {
        console.error('Ownership middleware error:', error);
        res.status(500).json({
          success: false,
          message: 'Authorization check failed'
        });
      }
    };
  };
}