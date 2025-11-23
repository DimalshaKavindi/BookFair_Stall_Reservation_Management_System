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