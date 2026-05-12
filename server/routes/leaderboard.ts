import { Router, Response, Request } from "express";
import { authMiddleware } from "../middleware/auth";
import { getPrisma } from "../lib/prisma";

const router = Router();

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

router.get(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const currentUserId = req.user?.id;

      if (!currentUserId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const users = await getPrisma().user.findMany({
        select: {
          id: true,
          name: true,
          image: true,
          points: true,
          createdAt: true,
          _count: {
            select: {
              reports: true,
              scans: true,
            },
          },
        },
        orderBy: [{ points: "desc" }, { createdAt: "asc" }],
      });

      const leaderboard = users.map((user, index) => ({
        id: user.id,
        name: user.name?.trim() || "Anonymous",
        image: user.image,
        points: user.points,
        reportCount: user._count.reports,
        scanCount: user._count.scans,
        rank: index + 1,
        createdAt: user.createdAt,
      }));

      const currentUser =
        leaderboard.find((entry) => entry.id === currentUserId) ?? null;

      const stats = {
        totalUsers: leaderboard.length,
        totalPoints: leaderboard.reduce((sum, entry) => sum + entry.points, 0),
        totalReports: leaderboard.reduce(
          (sum, entry) => sum + entry.reportCount,
          0,
        ),
      };

      res.status(200).json({
        success: true,
        data: {
          leaderboard: leaderboard.slice(0, 10),
          currentUser,
          stats,
        },
      });
    } catch (error) {
      console.error("Get leaderboard error:", error);
      res.status(500).json({
        success: false,
        error: "Terjadi kesalahan saat mengambil leaderboard",
      });
    }
  },
);

export default router;
