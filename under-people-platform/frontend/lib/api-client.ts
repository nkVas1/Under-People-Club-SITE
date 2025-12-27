/**
 * API Client - Centralized API calls
 * Все запросы к backend в одном месте
 */

import {
  AuthCallbackResponse,
  PublicProfileResponse,
  UserProfileResponse,
  ApiError,
} from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://upcworldbot-production.up.railway.app';

export class ApiClient {
  /**
   * Get auth headers with optional Bearer token
   */
  private static getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Exchange auth code for access token
   * @param code - Auth code from Telegram bot
   */
  static async exchangeAuthCode(code: string): Promise<AuthCallbackResponse> {
    try {
      console.log('🔐 [API] Exchanging auth code:', code);

      const response = await fetch(`${API_URL}/api/auth/callback`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ code }),
      });

      console.log('📨 [API] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' })) as ApiError;
        console.error('❌ [API] Exchange failed:', errorData);
        const errorMsg = Array.isArray(errorData.detail) 
          ? errorData.detail.join(', ') 
          : errorData.detail || `HTTP ${response.status}`;
        throw new Error(errorMsg);
      }

      const data: AuthCallbackResponse = await response.json();
      console.log('✅ [API] Auth successful, received token');
      return data;
    } catch (error) {
      console.error('❌ [API] exchangeAuthCode error:', error);
      throw error;
    }
  }

  /**
   * Get public profile by referral code
   * @param referralCode - User's referral code (e.g., "UP-XXXXX")
   */
  static async getPublicProfile(referralCode: string): Promise<PublicProfileResponse> {
    try {
      console.log('🔍 [API] Fetching public profile:', referralCode);

      const response = await fetch(`${API_URL}/api/users/u/${referralCode}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log('📨 [API] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Profile not found' })) as ApiError;
        console.error('❌ [API] Profile fetch failed:', errorData);
        const errorMsg = Array.isArray(errorData.detail) 
          ? errorData.detail.join(', ') 
          : errorData.detail || `HTTP ${response.status}`;
        throw new Error(errorMsg);
      }

      const data: PublicProfileResponse = await response.json();
      console.log('✅ [API] Profile loaded:', data);
      return data;
    } catch (error) {
      console.error('❌ [API] getPublicProfile error:', error);
      throw error;
    }
  }

  /**
   * Get current user profile (requires auth)
   */
  static async getUserProfile(): Promise<UserProfileResponse> {
    try {
      console.log('👤 [API] Fetching user profile');

      const response = await fetch(`${API_URL}/api/users/me`, {
        headers: this.getAuthHeaders(),
      });

      console.log('📨 [API] Response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch profile' })) as ApiError;
        const errorMsg = Array.isArray(errorData.detail) 
          ? errorData.detail.join(', ') 
          : errorData.detail || `HTTP ${response.status}`;
        throw new Error(errorMsg);
      }

      const data: UserProfileResponse = await response.json();
      console.log('✅ [API] User profile loaded');
      return data;
    } catch (error) {
      console.error('❌ [API] getUserProfile error:', error);
      throw error;
    }
  }

  /**
   * Logout user (optional - mainly for cleanup)
   */
  static async logout(): Promise<void> {
    try {
      console.log('👋 [API] Logging out');

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!token) {
        console.log('⚠️ [API] No token found, skipping logout request');
        return;
      }

      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      }).catch(() => {
        console.log('⚠️ [API] Logout request failed (not critical)');
      });

      console.log('✅ [API] Logged out');
    } catch (error) {
      console.error('❌ [API] logout error:', error);
    }
  }
}
