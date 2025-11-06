import { create } from 'zustand';
import { authAPI } from '../config/api';

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,

  // Initialize - check for token on app load
  initialize: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, isAuthenticated: false, isAdmin: false, loading: false });
      return;
    }

    try {
      const response = await authAPI.getProfile();
      if (response.data.success) {
        const userData = response.data.data;
        set({
          user: {
            id: userData._id,
            username: userData.username,
            email: userData.email,
            role: userData.role,
          },
          isAuthenticated: true,
          isAdmin: userData.role === 'admin',
          loading: false,
        });
      } else {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false, isAdmin: false, loading: false });
      }
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false, isAdmin: false, loading: false });
    }
  },

  // Login
  login: async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      if (response.data.success) {
        const { user, token } = response.data.data;
        localStorage.setItem('token', token);
        set({
          user: user,
          isAuthenticated: true,
          isAdmin: user.role === 'admin',
        });
        return { success: true };
      }
      return { success: false, message: 'Login failed' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  },

  // Register
  register: async (data) => {
    try {
      const response = await authAPI.register(data);
      if (response.data.success) {
        return { success: true, message: 'Registration successful' };
      }
      return { success: false, message: 'Registration failed' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false, isAdmin: false });
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false, isAdmin: false });
    }
  },
}));
