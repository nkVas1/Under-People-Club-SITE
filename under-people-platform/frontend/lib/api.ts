import axios from 'axios'
import { API_URL } from './config'

/**
 * API Client with automatic error logging
 * Uses NEXT_PUBLIC_API_URL environment variable
 */
const API_BASE_URL = API_URL

if (typeof window !== 'undefined') {
  console.log('🔌 API Client initialized with URL:', API_BASE_URL);
}

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Detailed error logging
    if (error.response) {
      // Server responded with error status
      console.error(`❌ API Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      // Request made but no response (network error)
      console.error('📡 Network Error - No response from server:', error.message);
      console.error('   Check if backend is running and CORS is configured');
    } else {
      // Error in request setup
      console.error('⚠️ Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient
