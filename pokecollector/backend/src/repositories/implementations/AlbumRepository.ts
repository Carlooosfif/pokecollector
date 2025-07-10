import { PrismaClient } from '@prisma/client';
import { IAlbumRepository } from '../interfaces/IAlbumRepository';
import { IAlbum, ICreateAlbum } from '../../models/interfaces/IAlbum';
import DatabaseConnection from '../../config/database';

export class AlbumRepository implements IAlbumRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = DatabaseConnection.getInstance().getClient();
  }

  async findById(id: string): Promise<IAlbum | null> {
    try {
      const album = await this.prisma.album.findUnique({
        where: { id },
        include: {
          _count: {
            select: { cards: true }
          }
        }
      });
      return album;
    } catch (error) {
      console.error('Error finding album by ID:', error);
      throw new Error('Failed to find album');
    }
  }

  async findByGeneration(generation: number): Promise<IAlbum[]> {
    try {
      const albums = await this.prisma.album.findMany({
        where: { generation },
        orderBy: { createdAt: 'asc' }
      });
      return albums;
    } catch (error) {
      console.error('Error finding albums by generation:', error);
      throw new Error('Failed to find albums');
    }
  }

  async create(albumData: ICreateAlbum): Promise<IAlbum> {
    try {
      const album = await this.prisma.album.create({
        data: albumData
      });
      return album;
    } catch (error) {
      console.error('Error creating album:', error);
      throw new Error('Failed to create album');
    }
  }

  async update(id: string, albumData: Partial<ICreateAlbum>): Promise<IAlbum | null> {
    try {
      const album = await this.prisma.album.update({
        where: { id },
        data: albumData
      });
      return album;
    } catch (error) {
      console.error('Error updating album:', error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.album.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('Error deleting album:', error);
      return false;
    }
  }

  async findAll(): Promise<IAlbum[]> {
    try {
      const albums = await this.prisma.album.findMany({
        orderBy: { generation: 'asc' }
      });
      return albums;
    } catch (error) {
      console.error('Error finding all albums:', error);
      throw new Error('Failed to find albums');
    }
  }

  async updateTotalCards(id: string, totalCards: number): Promise<boolean> {
    try {
      await this.prisma.album.update({
        where: { id },
        data: { totalCards }
      });
      return true;
    } catch (error) {
      console.error('Error updating total cards:', error);
      return false;
    }
  }
}