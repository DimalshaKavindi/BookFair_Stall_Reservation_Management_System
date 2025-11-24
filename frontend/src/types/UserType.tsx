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

export interface UserProfile {
    id: number;
    email: string;
    businessName: string;
    contactPerson: string;
    phone: string;
    address: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserProfileResponse {
    success: boolean;
    user: UserProfile;
}
export interface User {
  id: number;
  email: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  address: string;
  role: "VENDOR" | "EMPLOYEE";
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileResponse {
  success: boolean;
  user: User;
}