import { Album } from './album';

export type CardRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'HOLO' | 'LEGENDARY';

export interface Card {
  id: string;
  name: string;
  number: number;
  rarity: CardRarity;
  type?: string;
  albumId: string;
  imageUrl?: string;
  description?: string;
  album?: Album;
}

export interface CreateCardRequest {
  name: string;
  number: number;
  rarity: CardRarity;
  type?: string;
  albumId: string;
  imageUrl?: string;
  description?: string;
}

export interface UserCard {
  id: string;
  userId: string;
  cardId: string;
  obtainedAt: string;
  quantity: number;
  card: Card;
}

export interface AddCardToCollectionRequest {
  cardId: string;
  quantity?: number;
}