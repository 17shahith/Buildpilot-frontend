export interface AuthenticatedUser {
  id?: string;
  username?: string;
  fullName?: string;
  role: 'client' | 'pro' | 'admin';
  accessToken?: string;
}
