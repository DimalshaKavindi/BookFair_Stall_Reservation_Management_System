import type { Stall } from "./StallType";
import type { User } from "./UserType";

export interface Reservation {
  id: number;
  userId: number;
  stallId: number;
  status: "ACTIVE" | "CANCELLED" | "COMPLETED";
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt?: string;
  stall?: Stall;
  user?: Pick<User, "id" | "businessName" | "email">;
}

export interface ReservationsResponse {
  success: boolean;
  reservations: Reservation[];
}

export interface ReservationResponse {
  success: boolean;
  reservation: Reservation;
}