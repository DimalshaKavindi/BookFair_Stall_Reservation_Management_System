import axios from 'axios';

const API_BASE_URL = "http://localhost:4000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


export interface RegisterVendorData {
    email: string;
    password: string;
    businessName: string;
    contactPerson: string;
    phone: string;
    address: string;
}

export interface RegisterResponse {
    id: string;
    email: string;
    businessName: string;
    contactPerson: string;
    phone: string;
    address: string;
    role: string;
}

    export interface ApiError {
    status: number;
    message: string;
    }

export const authAPI = {
    registerVendor: async (data: RegisterVendorData): Promise<RegisterResponse> => {
        try {
        const response = await api.post<RegisterResponse>('/auth/register', data);
        return response.data;
        } catch (error: any) {
        if (error.response) {
            throw {
            status: error.response.status,
            message: error.response.data?.message || 'Registration failed',
            } as ApiError;
        }
        throw {
            status: 500,
            message: 'Network error. Please check your connection.',
        } as ApiError;
        }
    },
}