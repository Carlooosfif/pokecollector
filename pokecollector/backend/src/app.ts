import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import DatabaseConnection from './config/database';

// Importar rutas
import { AuthRoutes } from './routes/authRoutes';
import { UserRoutes } from './routes/userRoutes';
import { AlbumRoutes } from './routes/albumRoutes';
import { CardRoutes } from './routes/cardRoutes';

// Cargar variables de entorno
dotenv.config();

class App {
  public app: Application;
  private databaseConnection: DatabaseConnection;

  constructor() {
    this.app = express();
    this.databaseConnection = DatabaseConnection.getInstance();
    
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Middlewares de seguridad
    this.app.use(helmet());
    
    // CORS
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true
    }));

    // Parseo de JSON
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Log de requests en desarrollo
    if (process.env.NODE_ENV === 'development') {
      this.app.use((req: Request, res: Response, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
      });
    }
  }

  private initializeRoutes(): void {
    // Ruta de salud
    this.app.get('/health', async (req: Request, res: Response) => {
      try {
        const dbHealth = await this.databaseConnection.healthCheck();
        res.status(200).json({
          success: true,
          message: 'Server is running',
          timestamp: new Date().toISOString(),
          database: dbHealth ? 'connected' : 'disconnected'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Health check failed',
          timestamp: new Date().toISOString(),
          database: 'error'
        });
      }
    });

    // Rutas de la API
    this.app.use('/api/auth', new AuthRoutes().router);
    this.app.use('/api/users', new UserRoutes().router);
    this.app.use('/api/albums', new AlbumRoutes().router);
    this.app.use('/api/cards', new CardRoutes().router);

    // Ruta 404
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
      });
    });
  }

  private initializeErrorHandling(): void {
    // Manejador global de errores
    this.app.use((error: Error, req: Request, res: Response, next: any) => {
      console.error('Global error handler:', error);
      
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    });
  }

  public async initialize(): Promise<void> {
    try {
      // Conectar a la base de datos
      await this.databaseConnection.connect();
      console.log('✅ Database connection established');
    } catch (error) {
      console.error('❌ Failed to initialize application:', error);
      throw error;
    }
  }

  public async start(port: number = 3001): Promise<void> {
    try {
      await this.initialize();
      
      this.app.listen(port, () => {
        console.log('🚀 PokéCollector Backend Server started');
        console.log(`📍 Server running on port ${port}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 Health check: http://localhost:${port}/health`);
        console.log('='.repeat(50));
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  public async stop(): Promise<void> {
    try {
      await this.databaseConnection.disconnect();
      console.log('✅ Application stopped gracefully');
    } catch (error) {
      console.error('❌ Error stopping application:', error);
    }
  }
}

// Crear y exportar instancia de la aplicación
const application = new App();

// Manejar cierre graceful
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await application.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await application.stop();
  process.exit(0);
});

// Iniciar servidor si este archivo se ejecuta directamente
if (require.main === module) {
  const PORT = parseInt(process.env.PORT || '3001');
  application.start(PORT);
}

export default application;