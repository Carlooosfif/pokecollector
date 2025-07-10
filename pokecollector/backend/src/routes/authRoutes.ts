import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { ValidationMiddleware, ValidationSchemas } from '../middleware/validationMiddleware';

export class AuthRoutes {
  public router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // POST /api/auth/register
    this.router.post(
      '/register',
      ValidationMiddleware.validateBody(ValidationSchemas.registerUser),
      this.authController.register.bind(this.authController)
    );

    // POST /api/auth/login
    this.router.post(
      '/login',
      ValidationMiddleware.validateBody(ValidationSchemas.loginUser),
      this.authController.login.bind(this.authController)
    );

    // GET /api/auth/validate
    this.router.get(
      '/validate',
      this.authController.validateToken.bind(this.authController)
    );
  }
}