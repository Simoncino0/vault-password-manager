export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

export interface ApiError {
  error: string;
  fields?: Record<string, string>; // Per gli errori di validazione specifici per campo
}
