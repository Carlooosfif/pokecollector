export enum Rarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  HOLO = 'HOLO',
  LEGENDARY = 'LEGENDARY'
}

export interface ICard {
  id: string;
  name: string;
  number: number;
  rarity: Rarity;
  type?: string;
  albumId: string;
  imageUrl?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateCard {
  name: string;
  number: number;
  rarity: Rarity;
  type?: string;
  albumId: string;
  imageUrl?: string;
  description?: string;
}
