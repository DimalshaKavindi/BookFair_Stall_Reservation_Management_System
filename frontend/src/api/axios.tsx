import axios from 'axios';
import type { ApiError } from '../types/Error';
import type { RegisterResponse, RegisterVendorData } from '../types/RegisterType';
import type { ReservationResponse, ReservationsResponse } from '../types/ReservationType';
import type { Stall, StallResponse, StallsResponse } from '../types/StallType';
import type { UserProfile, UserProfileResponse } from '../types/UserType';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
    api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('authToken');
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

    api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
        sessionStorage.removeItem('authToken');
        window.location.href = '/';
        }
        return Promise.reject(error);
    }
    );

    function handleError(error: any): never {
  if (error.response) {
    throw {
      status: error.response.status,
      message: error.response.data?.message || "Request failed",
    } as ApiError;
  }
  throw {
    status: 500,
    message: "Network error. Please check your connection.",
  } as ApiError;
}
export const authAPI = {
    registerVendor: async (data: RegisterVendorData): Promise<RegisterResponse> => {
        try {
        const response = await api.post<RegisterResponse>('/auth/register', data);
        return response.data;
        } catch (error: any) {
        if (error.response) {
            const backendMessage = error.response.data?.message || error.response.data?.error || 'Registration failed';
            throw {
            status: error.response.status,
            message: backendMessage,
            details: error.response.data?.errors 
            } as ApiError;
        }
        throw {
            status: 500,
            message: 'Network error. Please check your connection.',
        } as ApiError;
        }
    },

    login: async (email: string, password: string, userType: 'vendor' | 'employee'|'admin') => {
        try {
        const endpoint = userType === 'employee' ? '/auth/employee/login' : userType === 'admin' ? 'auth/admin/login' : '/auth/login';
        const response = await api.post(endpoint, { email, password });
        if (response.data.token) {
            sessionStorage.setItem('authToken', response.data.token);
            sessionStorage.setItem('userRole', response.data.user?.role);
        }
        return response.data;
        } catch (error: any) {
        if (error.response) {
            throw {
            status: error.response.status,
            message: error.response.data?.message || 'Login failed',
            } as ApiError;
        }
        throw {
            status: 500,
            message: 'Network error. Please check your connection.',
        } as ApiError;
        }
    },
};
// Stalls API
export const stallsAPI = {
  getAll: async (): Promise<StallsResponse> => {
    try {
      const res = await api.get<StallsResponse>("/stalls");
      return res.data;
    } catch (e) {
      handleError(e);
    }
  },

  getAvailable: async (): Promise<StallsResponse> => {
    try {
      const res = await api.get<StallsResponse>("/stalls/available");
      return res.data;
    } catch (e) {
      handleError(e);
    }
  },

  getOne: async (id: number): Promise<StallResponse> => {
    try {
      const res = await api.get<StallResponse>(`/stalls/${id}`);
      return res.data;
    } catch (e) {
      handleError(e);
    }
  },

  update: async (id: number, data: Partial<Stall>): Promise<StallResponse> => {
    try {
      const res = await api.put<StallResponse>(`/stalls/${id}`, data);
      return res.data;
    } catch (e) {
      handleError(e);
    }
  },
};

// Reservations API
export const reservationsAPI = {
  create: async (stallId: number): Promise<ReservationResponse> => {
    try {
      const res = await api.post<ReservationResponse>("/reservations", { stallId });
      return res.data;
    } catch (e) {
      handleError(e);
    }
  },

  getForUser: async (userId: number): Promise<ReservationsResponse> => {
    try {
      const res = await api.get<ReservationsResponse>(`/reservations/user/${userId}`);
      return res.data;
    } catch (e) {
      handleError(e);
    }
  },

  getAll: async (): Promise<ReservationsResponse> => {
    try {
      const res = await api.get<ReservationsResponse>("/reservations");
      return res.data;
    } catch (e) {
      handleError(e);
    }
  },

  cancel: async (reservationId: number): Promise<{ success: boolean }> => {
    try {
      const res = await api.delete<{ success: boolean }>(`/reservations/${reservationId}`);
      return res.data;
    } catch (e) {
      handleError(e);
    }
  },

  updateGenres: async (reservationId: number, genres: string[]): Promise<ReservationResponse> => {
    try {
      const res = await api.patch<ReservationResponse>(`/reservations/${reservationId}/genres`, { genres });
      return res.data;
    } catch (e) {
      handleError(e);
    }
  },
};

// Users API
export const usersAPI = {
  getProfile: async (): Promise<UserProfileResponse> => {
    try {
      const res = await api.get<UserProfileResponse>("/users/profile");
      return res.data;
    } catch (e) {
      handleError(e);
    }
  },

  updateProfile: async (
    data: Partial<Pick<UserProfile, "businessName" | "contactPerson" | "phone" | "address">>
  ): Promise<UserProfileResponse> => {
    try {
      const res = await api.put<UserProfileResponse>("/users/profile", data);
      return res.data;
    } catch (e) {
      handleError(e);
    }
  },
};

export const userAPI = {
    getProfile: async (): Promise<UserProfile> => {
        try {
        const response = await api.get<UserProfileResponse>('/users/profile');
        return response.data.user;
        } catch (error: any) {
        if (error.response) {
            throw {
            status: error.response.status,
            message: error.response.data?.message || 'Failed to fetch profile',
            } as ApiError;
        }
        throw {
            status: 500,
            message: 'Network error. Please check your connection.',
        } as ApiError;
        }
    },

    updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
        try {
        const response = await api.put<UserProfileResponse>('/users/profile', data);
        return response.data.user;
        } catch (error: any) {
        if (error.response) {
            throw {
            status: error.response.status,
            message: error.response.data?.message || 'Failed to update profile',
            } as ApiError;
        }
        throw {
            status: 500,
            message: 'Network error. Please check your connection.',
        } as ApiError;
        }
    },
};
export const adminAPI = {
  // Employee Management
  createEmployee: async (data: {
    email: string;
    password: string;
    businessName: string;
    contactPerson: string;
    phone: string;
    address: string;
  }) => {
    try {
      const response = await api.post('/admin/employees', data);
      return response.data;
    } catch (error: any) {
      handleError(error);
    }
  },

  getEmployees: async () => {
    try {
      const response = await api.get('/admin/employees');
      return response.data;
    } catch (error: any) {
      handleError(error);
    }
  },

  // Stall Management
  createStall: async (data: {
    name: string;
    size: 'SMALL' | 'MEDIUM' | 'LARGE';
    dimensions: string;
    location: string;
    positionX: number;
    positionY: number;
    isAvailable?: boolean;
  }) => {
    try {
      const response = await api.post('/admin/stalls', data);
      return response.data;
    } catch (error: any) {
      handleError(error);
    }
  },

  getStalls: async () => {
    try {
      const response = await api.get('/admin/stalls');
      return response.data;
    } catch (error: any) {
      handleError(error);
    }
  },
};


export default api;