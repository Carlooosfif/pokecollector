import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { ICardRepository } from '../repositories/interfaces/ICardRepository';
import { IAlbumRepository } from '../repositories/interfaces/IAlbumRepository';
import { IUserCardRepository } from '../repositories/interfaces/IUserCardRepository';

import { UserRepository } from '../repositories/implementations/UserRepository';
import { CardRepository } from '../repositories/implementations/CardRepository';
import { AlbumRepository } from '../repositories/implementations/AlbumRepository';
import { UserCardRepository } from '../repositories/implementations/UserCardRepository';

/**
 * Factory Method Pattern - Crear repositorios sin exponer la lógica de instanciación
 * Principio SOLID: Dependency Inversion Principle (DIP)
 * Los servicios dependerán de interfaces, no de implementaciones concretas
 */
export class RepositoryFactory {
  private static userRepository: IUserRepository | null = null;
  private static cardRepository: ICardRepository | null = null;
  private static albumRepository: IAlbumRepository | null = null;
  private static userCardRepository: IUserCardRepository | null = null;

  /**
   * Crear instancia de UserRepository (Singleton)
   */
  public static createUserRepository(): IUserRepository {
    if (!this.userRepository) {
      this.userRepository = new UserRepository();
    }
    return this.userRepository;
  }

  /**
   * Crear instancia de CardRepository (Singleton)
   */
  public static createCardRepository(): ICardRepository {
    if (!this.cardRepository) {
      this.cardRepository = new CardRepository();
    }
    return this.cardRepository;
  }

  /**
   * Crear instancia de AlbumRepository (Singleton)
   */
  public static createAlbumRepository(): IAlbumRepository {
    if (!this.albumRepository) {
      this.albumRepository = new AlbumRepository();
    }
    return this.albumRepository;
  }

  /**
   * Crear instancia de UserCardRepository (Singleton)
   */
  public static createUserCardRepository(): IUserCardRepository {
    if (!this.userCardRepository) {
      this.userCardRepository = new UserCardRepository();
    }
    return this.userCardRepository;
  }

  /**
   * Limpiar instancias (útil para testing)
   */
  public static clearInstances(): void {
    this.userRepository = null;
    this.cardRepository = null;
    this.albumRepository = null;
    this.userCardRepository = null;
  }

  /**
   * Crear todos los repositorios de una vez
   */
  public static createAllRepositories(): {
    userRepository: IUserRepository;
    cardRepository: ICardRepository;
    albumRepository: IAlbumRepository;
    userCardRepository: IUserCardRepository;
  } {
    return {
      userRepository: this.createUserRepository(),
      cardRepository: this.createCardRepository(),
      albumRepository: this.createAlbumRepository(),
      userCardRepository: this.createUserCardRepository()
    };
  }
}