/**
 * Centralized API client for Buildpilot Frontend
 * Connects to the configured backend API. The base URL is intentionally
 * public configuration; authentication is handled by the backend session.
 */

const TIMEOUT_MS = 10000; // 10s request timeout
const MAX_RETRIES = 3;
let accessToken: string | null = null;

export interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  cacheTime?: number; // Cache duration in MS for GET requests (default 0 / disabled)
}

// Simple in-memory cache for GET requests
const responseCache = new Map<string, { data: any; expiry: number }>();
// In-flight request deduplication map
const pendingRequests = new Map<string, Promise<any>>();

class APIError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'APIError';
    this.status = status;
  }
}

/**
 * Helper to check network connectivity
 */
export const isOnline = (): boolean => {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
};

/**
 * Custom fetch wrapper with timeout
 */
const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new APIError('Request timeout. Please check your connection and try again.', 408);
    }
    throw error;
  }
};

/**
 * Central request executor with retry mechanism
 */
const executeRequest = async (url: string, options: RequestOptions = {}): Promise<any> => {
  const { timeout = TIMEOUT_MS, retries = MAX_RETRIES, ...fetchOptions } = options;
  const method = (fetchOptions.method || 'GET').toUpperCase();
  const canRetry = method === 'GET' || method === 'HEAD' || method === 'OPTIONS';
  const maxAttempts = canRetry ? Math.max(1, retries) : 1;

  if (!isOnline()) {
    throw new APIError('You are currently offline. Please check your network connection.', 0);
  }

  let attempt = 0;
  while (attempt < maxAttempts) {
    try {
      const response = await fetchWithTimeout(url, fetchOptions, timeout);

      if (!response.ok) {
        // Only retry on transient server errors (5xx)
        if (response.status >= 500 && attempt < maxAttempts - 1) {
          attempt++;
          // Exponential backoff
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 500));
          continue;
        }
        // Do not expose raw backend bodies, which may contain stack traces or
        // infrastructure details. The UI only needs a safe status-level error.
        throw new APIError(
          response.status >= 500
            ? 'The service is temporarily unavailable. Please try again.'
            : 'The request could not be completed. Please check your input and try again.',
          response.status
        );
      }

      if (response.status === 204) return null;
      return await response.json();
    } catch (error: any) {
      if (error instanceof APIError && error.status && error.status < 500) {
        throw error; // Don't retry client errors (4xx)
      }
      attempt++;
      if (attempt >= maxAttempts) {
        if (error instanceof APIError) throw error;
        throw new APIError(error.message || 'Network error occurred. Please try again.', 500);
      }
      // Delay before retrying
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 500));
    }
  }
};

/**
 * Centralized API Client
 */
export const api = {
  setAccessToken(token: string | null): void {
    // Keep optional bearer credentials in memory only. Persistent sessions
    // should use an HttpOnly, Secure, SameSite cookie managed by the backend.
    accessToken = token;
  },

  clearAccessToken(): void {
    accessToken = null;
  },

  getUri(path: string): string {
    const resolvedBase = import.meta.env.VITE_API_BASE_URL || '';
    
    const cleanBase = resolvedBase.replace(/\/+$/, '');
    const cleanPath = path.replace(/^\/+/, '');
    
    if (!cleanBase) {
      return `/${cleanPath}`;
    }
    
    // Guard against duplicate /api prefix
    if (cleanBase.endsWith('/api') && cleanPath.startsWith('api/')) {
      return `${cleanBase}/${cleanPath.substring(4)}`;
    }
    
    return `${cleanBase}/${cleanPath}`;
  },

  async request(path: string, options: RequestOptions = {}): Promise<any> {
    const url = this.getUri(path);
    const method = options.method || 'GET';
    const isGet = method.toUpperCase() === 'GET';
    const headers = new Headers(options.headers);

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const requestOptions: RequestOptions = {
      ...options,
      headers,
      // Enables secure cookie-based sessions without exposing cookies to JS.
      credentials: options.credentials || 'include',
    };

    // Caching/Deduplication for GET requests
    if (isGet) {
      const cacheKey = `${url}:${JSON.stringify([...headers.entries()])}`;
      
      // Check active cache
      const cached = responseCache.get(cacheKey);
      if (cached && cached.expiry > Date.now()) {
        return cached.data;
      }

      // Check pending request to deduplicate
      if (pendingRequests.has(cacheKey)) {
        return pendingRequests.get(cacheKey);
      }

      const promise = executeRequest(url, requestOptions).then((data) => {
        pendingRequests.delete(cacheKey);
        // Cache if cacheTime is specified
        if (options.cacheTime && options.cacheTime > 0) {
          responseCache.set(cacheKey, {
            data,
            expiry: Date.now() + options.cacheTime,
          });
        }
        return data;
      }).catch((err) => {
        pendingRequests.delete(cacheKey);
        throw err;
      });

      pendingRequests.set(cacheKey, promise);
      return promise;
    }

    // Direct execution for non-GET requests (POST, PUT, PATCH, DELETE)
    return executeRequest(url, requestOptions);
  },

  async get(path: string, options: RequestOptions = {}): Promise<any> {
    return this.request(path, { ...options, method: 'GET' });
  },

  async post(path: string, body: any, options: RequestOptions = {}): Promise<any> {
    return this.request(path, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      body: JSON.stringify(body),
    });
  },

  async put(path: string, body: any, options: RequestOptions = {}): Promise<any> {
    return this.request(path, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      body: JSON.stringify(body),
    });
  },

  async patch(path: string, body: any, options: RequestOptions = {}): Promise<any> {
    return this.request(path, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      body: JSON.stringify(body),
    });
  },

  async delete(path: string, options: RequestOptions = {}): Promise<any> {
    return this.request(path, { ...options, method: 'DELETE' });
  },

  // Upload utility for file uploads
  async upload(path: string, formData: FormData, options: RequestOptions = {}): Promise<any> {
    return this.request(path, {
      ...options,
      method: 'POST',
      headers: {
        // Let browser set the Content-Type automatically for boundary multipart/form-data
        ...(options.headers || {}),
      },
      body: formData,
    });
  },
};
