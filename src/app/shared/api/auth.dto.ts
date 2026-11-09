export type AuthRole = 'reader' | 'publisher' | 'admin';

export interface AuthUserDto {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  photo?: string;
}

export interface AuthLoginResponse {
  success: boolean;
  token: string;
  user: AuthUserDto;
}

export interface AuthErrorResponse {
  success: false;
  message: string;
}
