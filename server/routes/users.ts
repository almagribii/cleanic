import express, { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";
import prisma from "../lib/prisma";
import bcryptjs from "bcryptjs";

const router = Router();

// GET current user profile
router.get("/profile", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        points: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ data: user });
  } catch (err) {
    console.error("GET /profile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT update user profile
router.put("/profile", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { name, email, image, currentPassword, newPassword } = req.body;

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // If changing password, verify current password
    let hashedPassword: string | undefined;
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: "Current password is required" });
      }

      const isPasswordValid = await bcryptjs.compare(
        currentPassword,
        currentUser.password || "",
      );

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      hashedPassword = await bcryptjs.hash(newPassword, 10);
    }

    // If email is changing, check if it's unique
    if (email && email !== currentUser.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(image && { image }),
        ...(hashedPassword && { password: hashedPassword }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        points: true,
        createdAt: true,
      },
    });

    res.json({ data: updatedUser, message: "Profile updated successfully" });
  } catch (err) {
    console.error("PUT /profile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
