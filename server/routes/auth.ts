import { config } from "dotenv";
import { Router, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword, generateToken } from "../lib/auth";
import { authMiddleware } from "../middleware/auth";

// Ensure environment variables are loaded
config();

interface AuthPayload {
  email: string;
  password: string;
  name?: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user?: any;
    token?: string;
  };
  error?: string;
}

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

const router = Router();

// Create Prisma client lazily
let prismaInstance: PrismaClient | null = null;

function getPrisma() {
  if (!prismaInstance) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set in environment variables");
    }
    
    prismaInstance = new PrismaClient();
  }
  return prismaInstance;
}

/**
 * POST /auth/register
 * Register user baru dengan email dan password
 */
router.post("/register", async (req, res): Promise<void> => {
  try {
    const { email, password, name } = req.body as AuthPayload;

    // Validasi input
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: "Email dan password harus diisi",
      } as AuthResponse);
      return;
    }

    // Cek email sudah ada
    const existingUser = await getPrisma().user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        error: "Email sudah terdaftar",
      } as AuthResponse);
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Buat user baru
    const user = await getPrisma().user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split("@")[0],
      },
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        },
        token,
      },
    } as AuthResponse);
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan saat registrasi",
    } as AuthResponse);
  }
});

/**
 * POST /auth/login
 * Login dengan email dan password
 */
router.post("/login", async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body as AuthPayload;

    // Validasi input
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: "Email dan password harus diisi",
      } as AuthResponse);
      return;
    }

    // Cari user
    const user = await getPrisma().user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: "Email atau password salah",
      } as AuthResponse);
      return;
    }

    // Cek password
    if (!user.password) {
      res.status(401).json({
        success: false,
        error: "User ini menggunakan social login",
      } as AuthResponse);
      return;
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: "Email atau password salah",
      } as AuthResponse);
      return;
    }

    // Generate token
    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          points: user.points,
        },
        token,
      },
    } as AuthResponse);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan saat login",
    } as AuthResponse);
  }
});

/**
 * GET /auth/me
 * Dapatkan data user yang sedang login
 */
router.get("/me", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
      } as AuthResponse);
      return;
    }

    const user = await getPrisma().user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        points: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: "User tidak ditemukan",
      } as AuthResponse);
      return;
    }

    res.status(200).json({
      success: true,
      data: { user },
    } as AuthResponse);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan",
    } as AuthResponse);
  }
});

/**
 * POST /auth/logout
 * Logout user (cleanup di client side)
 */
router.post("/logout", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout berhasil",
    } as AuthResponse);
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan saat logout",
    } as AuthResponse);
  }
});

/**
 * POST /auth/refresh-token
 * Refresh JWT token
 */
router.post("/refresh-token", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
      } as AuthResponse);
      return;
    }

    const token = generateToken(userId);

    res.status(200).json({
      success: true,
      message: "Token berhasil di-refresh",
      data: { token },
    } as AuthResponse);
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan saat refresh token",
    } as AuthResponse);
  }
});

export default router;
