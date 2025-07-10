export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  token: string;
}