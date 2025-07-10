import { Request, Response } from 'express';
import { IAlbumService } from '../services/interfaces/IAlbumService';
import { AlbumService } from '../services/implementations/AlbumService';

export class AlbumController {
  private albumService: IAlbumService;

  constructor() {
    this.albumService = new AlbumService();
  }

  async getAllAlbums(req: Request, res: Response): Promise<void> {
    try {
      const albums = await this.albumService.getAllAlbums();
      res.status(200).json({
        success: true,
        message: 'Albums retrieved successfully',
        data: albums
      });
    } catch (error: any) {
      console.error('Get all albums error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get albums'
      });
    }
  }

  async getAlbumById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, message: 'Album ID is required' });
        return;
      }

      const album = await this.albumService.getAlbumById(id as string);

      if (!album) {
        res.status(404).json({
          success: false,
          message: 'Album not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Album retrieved successfully',
        data: album
      });
    } catch (error: any) {
      console.error('Get album by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get album'
      });
    }
  }

  async getAlbumsByGeneration(req: Request, res: Response): Promise<void> {
    try {
      const { generation } = req.params;

      if (!generation) {
        res.status(400).json({
          success: false,
          message: 'Generation is required'
        });
        return;
      }

      const generationNum = parseInt(generation);
      if (isNaN(generationNum) || generationNum < 1) {
        res.status(400).json({
          success: false,
          message: 'Invalid generation number'
        });
        return;
      }

      const albums = await this.albumService.getAlbumsByGeneration(generationNum);

      res.status(200).json({
        success: true,
        message: 'Albums retrieved successfully',
        data: albums
      });
    } catch (error: any) {
      console.error('Get albums by generation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get albums'
      });
    }
  }

  async createAlbum(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, generation, imageUrl } = req.body;
      const createdById = req.user?.userId;

      if (!createdById) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const albumData = {
        name,
        description,
        generation,
        imageUrl,
        createdById
      };

      const album = await this.albumService.createAlbum(albumData);

      res.status(201).json({
        success: true,
        message: 'Album created successfully',
        data: album
      });
    } catch (error: any) {
      console.error('Create album error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create album'
      });
    }
  }

  async updateAlbum(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Album ID is required'
        });
        return;
      }

      const { name, description, generation, imageUrl } = req.body;

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (generation !== undefined) updateData.generation = generation;
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

      const updatedAlbum = await this.albumService.updateAlbum(id as string, updateData);

      if (!updatedAlbum) {
        res.status(404).json({
          success: false,
          message: 'Album not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Album updated successfully',
        data: updatedAlbum
      });
    } catch (error: any) {
      console.error('Update album error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update album'
      });
    }
  }

  async deleteAlbum(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Album ID is required'
        });
        return;
      }

      const deleted = await this.albumService.deleteAlbum(id as string);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Album not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Album deleted successfully'
      });
    } catch (error: any) {
      console.error('Delete album error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete album'
      });
    }
  }
}
