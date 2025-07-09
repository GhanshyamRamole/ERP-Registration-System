import { API_ENDPOINTS, createAuthHeaders, handleApiError } from '../config/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  department: string;
  job_title: string;
  phone: string;
  company_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  company?: {
    id: number;
    company_name: string;
    industry: string;
    company_size: string;
    website: string;
    tax_id: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip_code: string;
      country: string;
    };
  };
}

export interface LoginResponse {
  token: string;
  user: User;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    // Load from localStorage on initialization
    this.token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        this.user = JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: createAuthHeaders(),
        body: JSON.stringify(credentials),
      });

      await handleApiError(response);
      const data: LoginResponse = await response.json();

      // Store token and user data
      this.token = data.token;
      this.user = data.user;
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async getProfile(): Promise<User> {
    if (!this.token) {
      throw new Error('No authentication token available');
    }

    try {
      const response = await fetch(API_ENDPOINTS.PROFILE, {
        method: 'GET',
        headers: createAuthHeaders(this.token),
      });

      await handleApiError(response);
      const user: User = await response.json();

      // Update stored user data
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));

      return user;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    if (!this.token) {
      throw new Error('No authentication token available');
    }

    try {
      const response = await fetch(API_ENDPOINTS.PROFILE, {
        method: 'PUT',
        headers: createAuthHeaders(this.token),
        body: JSON.stringify(userData),
      });

      await handleApiError(response);
      const user: User = await response.json();

      // Update stored user data
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));

      return user;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  async checkHealth(): Promise<{ status: string }> {
    try {
      const response = await fetch(API_ENDPOINTS.HEALTH);
      await handleApiError(response);
      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();