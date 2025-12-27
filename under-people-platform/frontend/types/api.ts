/**
 * API Response Types
 * Типы для всех ответов от backend API
 */

export interface AuthCallbackResponse {
  access_token: string;
  token_type: 'bearer';
  user: {
    id: number;
    username: string | null;
    first_name: string | null;
    role: string;
    referral_code?: string;
    avatar_url?: string;
    up_coins?: number;
    clan_name?: string;
    is_verified?: boolean;
    telegram_id?: number;
  };
}

export interface PublicProfileResponse {
  id: number;
  username: string | null;
  first_name: string | null;
  referral_code: string;
  membership_level: string;
  is_verified: boolean;
  avatar_url: string;
  created_at: string | null;
}

export interface UserProfileResponse {
  id: number;
  username: string | null;
  first_name: string | null;
  telegram_id: number;
  referral_code: string;
  avatar_url: string;
  role: string;
  up_coins: number;
  clan_name: string | null;
  is_verified: boolean;
  created_at: string | null;
  updated_at?: string | null;
}

export interface ApiError {
  detail: string | string[];
  type?: string;
  status?: number;
}

export interface ApiResponse<T> {
  status: string;
  data?: T;
  error?: ApiError;
}
