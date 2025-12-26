/**
 * API Client для работы с Backend
 * Автоматически добавляет JWT токен во все запросы
 */

import { useAuthStore } from '@/store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiError {
  message: string;
  status: number;
  code?: string;
}

class ApiClient {
  private apiUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.apiUrl = baseUrl;
  }

  /**
   * Получает токен из хранилища
   */
  private getToken(): string | null {
    try {
      const state = useAuthStore.getState();
      return state.user?.token || null;
    } catch (e) {
      console.warn('[API] Could not get token from store');
      return null;
    }
  }

  /**
   * Подготавливает headers с токеном
   */
  private getHeaders(customHeaders?: Record<string, string>) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Обработка ошибок
   */
  private async handleError(response: Response): Promise<ApiError> {
    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch {
      // Response не JSON
    }

    const error: ApiError = {
      message: errorData.message || errorData.error || 'Unknown error',
      status: response.status,
      code: errorData.code,
    };

    console.error(`[API ${response.status}]`, error.message);
    return error;
  }

  /**
   * GET запрос
   */
  async get<T = any>(
    endpoint: string,
    options?: RequestInit
  ): Promise<{ data?: T; error?: ApiError }> {
    try {
      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
        ...options,
      });

      if (!response.ok) {
        const error = await this.handleError(response);
        return { error };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('[API GET ERROR]', error);
      return {
        error: {
          message: error instanceof Error ? error.message : 'Network error',
          status: 0,
        },
      };
    }
  }

  /**
   * POST запрос
   */
  async post<T = any>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<{ data?: T; error?: ApiError }> {
    try {
      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
        ...options,
      });

      if (!response.ok) {
        const error = await this.handleError(response);
        return { error };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('[API POST ERROR]', error);
      return {
        error: {
          message: error instanceof Error ? error.message : 'Network error',
          status: 0,
        },
      };
    }
  }

  /**
   * PUT запрос
   */
  async put<T = any>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<{ data?: T; error?: ApiError }> {
    try {
      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
        ...options,
      });

      if (!response.ok) {
        const error = await this.handleError(response);
        return { error };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('[API PUT ERROR]', error);
      return {
        error: {
          message: error instanceof Error ? error.message : 'Network error',
          status: 0,
        },
      };
    }
  }

  /**
   * DELETE запрос
   */
  async delete<T = any>(
    endpoint: string,
    options?: RequestInit
  ): Promise<{ data?: T; error?: ApiError }> {
    try {
      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        ...options,
      });

      if (!response.ok) {
        const error = await this.handleError(response);
        return { error };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('[API DELETE ERROR]', error);
      return {
        error: {
          message: error instanceof Error ? error.message : 'Network error',
          status: 0,
        },
      };
    }
  }
}

// Экспортируем singleton инстанс
export const apiClient = new ApiClient();

/**
 * Типы ответов от backend'а
 */
export interface TelegramAuthResponse {
  user: {
    id: string;
    username: string;
    telegram_id: number;
    up_coins: number;
    role: string;
    clan: string;
    ref_code: string;
    avatar_url?: string;
    is_verified: boolean;
  };
  access_token: string;
}

export interface ProfileResponse {
  user: {
    id: string;
    username: string;
    telegram_id: number;
    up_coins: number;
    role: string;
    clan: string;
    ref_code: string;
    avatar_url?: string;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface PublicProfileResponse {
  user: {
    id: string;
    username: string;
    up_coins: number;
    role: string;
    clan: string;
    ref_code: string;
    avatar_url?: string;
    is_verified: boolean;
  };
}

/**
 * Пример использования в компоненте:
 * 
 * const { data: profile, error } = await apiClient.get<ProfileResponse>('/api/profile');
 * if (error) {
 *   console.error('Failed to fetch profile:', error.message);
 *   return;
 * }
 * console.log(profile.user);
 */
