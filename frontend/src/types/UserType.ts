export interface UserProfile {
    id: number;
    email: string;
    businessName: string;
    contactPerson: string;
    phone: string;
    address: string;
    role: "VENDOR" | "EMPLOYEE";
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