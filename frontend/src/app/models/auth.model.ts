export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  username: string;
}

export interface User {
  username: string;
  email?: string;
  authorities?: string[];
}

export interface ApiError {
  error: string;
}
