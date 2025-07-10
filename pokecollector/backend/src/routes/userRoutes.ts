import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { AuthMiddleware } from '../middleware/authMiddleware';
import { RoleMiddleware } from '../middleware/roleMiddleware';

export class UserRoutes {
  public router: Router;
  private userController: UserController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // GET /api/users/profile - Obtener perfil del usuario autenticado
    this.router.get(
      '/profile',
      this.authMiddleware.authenticateToken,
      this.userController.getProfile.bind(this.userController)
    );

    // PUT /api/users/profile - Actualizar perfil del usuario autenticado
    this.router.put(
      '/profile',
      this.authMiddleware.authenticateToken,
      this.userController.updateProfile.bind(this.userController)
    );

    // GET /api/users/stats - Obtener estadísticas del usuario autenticado
    this.router.get(
      '/stats',
      this.authMiddleware.authenticateToken,
      this.userController.getUserStats.bind(this.userController)
    );

    // GET /api/users/ranking - Obtener ranking de usuarios (público)
    this.router.get(
      '/ranking',
      this.userController.getRanking.bind(this.userController)
    );

    // GET /api/users - Obtener todos los usuarios (solo admin)
    this.router.get(
      '/',
      this.authMiddleware.authenticateToken,
      RoleMiddleware.requireAdmin,
      this.userController.getAllUsers.bind(this.userController)
    );
  }
}