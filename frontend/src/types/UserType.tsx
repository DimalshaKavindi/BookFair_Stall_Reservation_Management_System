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