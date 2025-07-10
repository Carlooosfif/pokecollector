import { Router } from 'express';
import { CardController } from '../controllers/cardController';
import { AuthMiddleware } from '../middleware/authMiddleware';
import { RoleMiddleware } from '../middleware/roleMiddleware';
import { ValidationMiddleware, ValidationSchemas } from '../middleware/validationMiddleware';
import Joi from 'joi';

export class CardRoutes {
  public router: Router;
  private cardController: CardController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.cardController = new CardController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // ===================== RUTAS PÚBLICAS =====================
    
    // GET /api/cards - Obtener todas las cartas (público)
    this.router.get(
      '/',
      this.cardController.getAllCards.bind(this.cardController)
    );

    // GET /api/cards/:id - Obtener carta por ID (público)
    this.router.get(
      '/:id',
      ValidationMiddleware.validateParams(ValidationSchemas.mongoId),
      this.cardController.getCardById.bind(this.cardController)
    );

    // GET /api/cards/album/:albumId - Obtener cartas por álbum (público)
    this.router.get(
      '/album/:albumId',
      ValidationMiddleware.validateParams(
        Joi.object({
          albumId: Joi.string().required()
        })
      ),
      this.cardController.getCardsByAlbum.bind(this.cardController)
    );

    // ===================== RUTAS DE ADMINISTRACIÓN (ADMIN) =====================
    
    // POST /api/cards - Crear carta (solo admin)
    this.router.post(
      '/',
      this.authMiddleware.authenticateToken,
      RoleMiddleware.requireAdmin,
      ValidationMiddleware.validateBody(ValidationSchemas.createCard),
      this.cardController.createCard.bind(this.cardController)
    );

    // PUT /api/cards/:id - Actualizar carta (solo admin)
    this.router.put(
      '/:id',
      this.authMiddleware.authenticateToken,
      RoleMiddleware.requireAdmin,
      ValidationMiddleware.validateParams(ValidationSchemas.mongoId),
      ValidationMiddleware.validateBody(
        Joi.object({
          name: Joi.string().min(2).max(100).optional(),
          number: Joi.number().integer().min(1).max(999).optional(),
          rarity: Joi.string().valid('COMMON', 'UNCOMMON', 'RARE', 'HOLO', 'LEGENDARY').optional(),
          type: Joi.string().max(50).optional(),
          imageUrl: Joi.string().uri().optional(),
          description: Joi.string().max(500).optional()
        })
      ),
      this.cardController.updateCard.bind(this.cardController)
    );

    // DELETE /api/cards/:id - Eliminar carta (solo admin)
    this.router.delete(
      '/:id',
      this.authMiddleware.authenticateToken,
      RoleMiddleware.requireAdmin,
      ValidationMiddleware.validateParams(ValidationSchemas.mongoId),
      this.cardController.deleteCard.bind(this.cardController)
    );

    // ===================== RUTAS DE COLECCIÓN DE USUARIOS =====================
    
    // GET /api/cards/collection/my - Obtener colección del usuario autenticado
    this.router.get(
      '/collection/my',
      this.authMiddleware.authenticateToken,
      this.cardController.getUserCollection.bind(this.cardController)
    );

    // POST /api/cards/collection - Agregar carta a la colección del usuario
    this.router.post(
      '/collection',
      this.authMiddleware.authenticateToken,
      ValidationMiddleware.validateBody(
        Joi.object({
          cardId: Joi.string().required(),
          quantity: Joi.number().integer().min(1).max(99).optional()
        })
      ),
      this.cardController.addCardToCollection.bind(this.cardController)
    );

    // DELETE /api/cards/collection/:cardId - Eliminar carta de la colección
    this.router.delete(
      '/collection/:cardId',
      this.authMiddleware.authenticateToken,
      ValidationMiddleware.validateParams(
        Joi.object({
          cardId: Joi.string().required()
        })
      ),
      this.cardController.removeCardFromCollection.bind(this.cardController)
    );

    // PUT /api/cards/collection/:userCardId/quantity - Actualizar cantidad de carta
    this.router.put(
      '/collection/:userCardId/quantity',
      this.authMiddleware.authenticateToken,
      ValidationMiddleware.validateParams(
        Joi.object({
          userCardId: Joi.string().required()
        })
      ),
      ValidationMiddleware.validateBody(
        Joi.object({
          quantity: Joi.number().integer().min(1).max(99).required()
        })
      ),
      this.cardController.updateCardQuantity.bind(this.cardController)
    );
  }
}