import { Router } from 'express';
import Joi from 'joi';
import { AlbumController } from '../controllers/albumController';
import { AuthMiddleware } from '../middleware/authMiddleware';
import { RoleMiddleware } from '../middleware/roleMiddleware';
import { ValidationMiddleware, ValidationSchemas } from '../middleware/validationMiddleware';

export class AlbumRoutes {
  public router: Router;
  private albumController: AlbumController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.albumController = new AlbumController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // GET /api/albums - Obtener todos los álbumes (público)
    this.router.get(
      '/',
      this.albumController.getAllAlbums.bind(this.albumController)
    );

    // GET /api/albums/generation/:generation - Obtener álbumes por generación (público)
    this.router.get(
      '/generation/:generation',
      ValidationMiddleware.validateParams(
        Joi.object({
          generation: Joi.number().integer().min(1).max(10).required()
        })
      ),
      this.albumController.getAlbumsByGeneration.bind(this.albumController)
    );
    this.router.get(
      '/:id',
      ValidationMiddleware.validateParams(ValidationSchemas.mongoId),
      this.albumController.getAlbumById.bind(this.albumController)
    );

    // POST /api/albums - Crear álbum (solo admin)
    this.router.post(
      '/',
      this.authMiddleware.authenticateToken,
      RoleMiddleware.requireAdmin,
      ValidationMiddleware.validateBody(ValidationSchemas.createAlbum),
      this.albumController.createAlbum.bind(this.albumController)
    );

    // PUT /api/albums/:id - Actualizar álbum (solo admin)
    this.router.put(
      '/:id',
      this.authMiddleware.authenticateToken,
      RoleMiddleware.requireAdmin,
      ValidationMiddleware.validateParams(ValidationSchemas.mongoId),
      this.albumController.updateAlbum.bind(this.albumController)
    );

    // DELETE /api/albums/:id - Eliminar álbum (solo admin)
    this.router.delete(
      '/:id',
      this.authMiddleware.authenticateToken,
      RoleMiddleware.requireAdmin,
      ValidationMiddleware.validateParams(ValidationSchemas.mongoId),
      this.albumController.deleteAlbum.bind(this.albumController)
    );
  }
}