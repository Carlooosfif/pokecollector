export interface IAlbum {
  id: string;
  name: string;
  description: string | null;
  generation: number;
  totalCards: number;
  imageUrl: string | null;
  createdAt: Date;
  createdById: string | null;
}

export interface ICreateAlbum {
  name: string;
  description?: string;
  generation: number;
  imageUrl?: string;
  createdById?: string;
}