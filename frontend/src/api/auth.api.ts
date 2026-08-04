import { api } from '../utils/api';
import { AuthenticatedUser } from '../types/auth';

export const authApi = {
  login: async (credentials: any): Promise<{ user: AuthenticatedUser }> => {
    return api.post('api/auth/login', credentials, { retries: 1 });
  },
  logout: async (): Promise<void> => {
    return api.post('api/auth/logout', {}, { retries: 1 });
  },
  getSession: async (): Promise<{ user: AuthenticatedUser }> => {
    return api.get('api/auth/session', { retries: 1 });
  }
};
