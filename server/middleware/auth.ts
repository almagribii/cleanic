import "dotenv/config";
import { Response, NextFunction, Request } from "express";
import { extractTokenFromHeader, verifyToken } from "../lib/auth";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

/**
 * Middleware untuk verifikasi JWT token
 */
export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        success: false,
        error: "No token provided",
      });
      return;
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(401).json({
        success: false,
        error: "Invalid or expired token",
      });
      return;
    }

    req.user = {
      id: decoded.userId,
    };

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Authentication error",
    });
  }
}

/**
 * Middleware untuk optional authentication
 * (tidak wajib punya token, tapi jika ada akan di-verify)
 */
export function optionalAuthMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        req.user = {
          id: decoded.userId,
        };
      }
    }

    next();
  } catch (error) {
    next();
  }
}
