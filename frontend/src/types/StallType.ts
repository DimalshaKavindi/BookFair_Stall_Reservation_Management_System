export interface Stall {
  id: number;
  name: string;
  size: "SMALL" | "MEDIUM" | "LARGE";
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface StallsResponse {
  success: boolean;
  stalls: Stall[];
}

export interface StallResponse {
  success: boolean;
  stall: Stall;
}
