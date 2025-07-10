import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export class ValidationMiddleware {
  /**
   * Middleware genérico para validar el body de la request
   */
  public static validateBody = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        const { error } = schema.validate(req.body);

        if (error) {
          res.status(400).json({
            success: false,
            message: 'Validation error',
            details: error.details.map(detail => detail.message)
          });
          return;
        }

        next();
      } catch (error) {
        console.error('Validation middleware error:', error);
        res.status(500).json({
          success: false,
          message: 'Validation failed'
        });
      }
    };
  };

  /**
   * Middleware para validar parámetros de la URL
   */
  public static validateParams = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        const { error } = schema.validate(req.params);

        if (error) {
          res.status(400).json({
            success: false,
            message: 'Invalid parameters',
            details: error.details.map(detail => detail.message)
          });
          return;
        }

        next();
      } catch (error) {
        console.error('Params validation middleware error:', error);
        res.status(500).json({
          success: false,
          message: 'Parameter validation failed'
        });
      }
    };
  };
}

// Esquemas de validación comunes
export const ValidationSchemas = {
  // Validación para registro de usuario
  registerUser: Joi.object({
    username: Joi.string().alphanum().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('COMMON', 'ADMIN').optional()
  }),

  // Validación para login
  loginUser: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // Validación para ID de parámetros
  mongoId: Joi.object({
    id: Joi.string().required()
  }),

  // Validación para crear álbum
  createAlbum: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500).optional(),
    generation: Joi.number().integer().min(1).max(10).required(),
    imageUrl: Joi.string().uri().optional()
  }),

  // Validación para crear carta
  createCard: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    number: Joi.number().integer().min(1).max(999).required(),
    rarity: Joi.string().valid('COMMON', 'UNCOMMON', 'RARE', 'HOLO', 'LEGENDARY').required(),
    type: Joi.string().max(50).optional(),
    albumId: Joi.string().required(),
    imageUrl: Joi.string().uri().optional(),
    description: Joi.string().max(500).optional()
  })
};