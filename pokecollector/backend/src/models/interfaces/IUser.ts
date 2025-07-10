export interface IUser {
  id: string;
  username?: string;
  email?: string;
  passwordHash?: string;
  role?: 'COMMON' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateUser {
  username: string;
  email: string;
  password: string;
  role?: 'COMMON' | 'ADMIN';
}

export interface IUpdateUser {
  username?: string;
  email?: string;
  password?: string;
}