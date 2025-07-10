export interface IUserCard {
  id: string;
  userId: string;
  cardId: string;
  obtainedAt: Date;
  quantity: number;
}

export interface ICreateUserCard {
  userId: string;
  cardId: string;
  quantity?: number;
}