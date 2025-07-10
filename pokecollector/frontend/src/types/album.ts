export interface Album {
  id: string;
  name: string;
  description?: string;
  generation: number;
  totalCards: number;
  imageUrl?: string;
  createdAt: string;
  createdById?: string;
}

export interface CreateAlbumRequest {
  name: string;
  description?: string;
  generation: number;
  imageUrl?: string;
}
