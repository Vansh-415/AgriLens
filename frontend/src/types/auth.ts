export interface User {
  _id?: string;
  id?: string;
  email: string;
  full_name: string;
  role: 'admin' | 'farmer';
  account_status?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens?: AuthTokens;
    access_token?: string;
    refresh_token?: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
}
