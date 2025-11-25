import type { Stall } from "./StallType";
import type { UserProfile } from "./UserType";

export interface Reservation {
  reservationDate: string;
  literaryGenres: never[];
  id: number;
  userId: number;
  stallId: number;
  status: "ACTIVE" | "CANCELLED" | "COMPLETED";
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt?: string;
  stall?: Stall;
  user?: UserProfile;
}

export interface ReservationsResponse {
  success: boolean;
  reservations: Reservation[];
}

export interface ReservationResponse {
  success: boolean;
  reservation: Reservation;
}