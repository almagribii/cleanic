import { Request } from "express";
import type { User } from "@prisma/client";

/**
 * Extended Request dengan user data
 */
export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

/**
 * Response untuk auth endpoints
 */
export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user?: Partial<User>;
    token?: string;
  };
  error?: string;
}

/**
 * Login/Register request payload
 */
export interface AuthPayload {
  email: string;
  password: string;
  name?: string;
}
