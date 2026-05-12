import { Router, Response, Request } from "express";
import { authMiddleware } from "../middleware/auth";
import { addUserPoints, getUserById } from "../lib/user";
import { getPrisma } from "../lib/prisma";

const router = Router();
const REPORT_POINTS = 50;

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

type CreateReportPayload = {
  imageUrl: string;
  latitude: number;
  longitude: number;
  address: string;
  description?: string;
};

router.post(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { imageUrl, latitude, longitude, address, description } =
        req.body as CreateReportPayload;

      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      if (
        !imageUrl ||
        !address ||
        typeof latitude !== "number" ||
        typeof longitude !== "number" ||
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        res.status(400).json({
          success: false,
          error: "imageUrl, address, latitude, dan longitude wajib diisi",
        });
        return;
      }

      const prisma = getPrisma();

      const createdReport = await prisma.report.create({
        data: {
          userId,
          imageUrl,
          latitude,
          longitude,
          address,
          description,
        },
      });

      await addUserPoints(userId, REPORT_POINTS);

      const updatedUser = await getUserById(userId);

      res.status(201).json({
        success: true,
        message: "Laporan berhasil dibuat",
        data: {
          report: createdReport,
          pointsEarned: REPORT_POINTS,
          user: updatedUser,
        },
      });
    } catch (error) {
      console.error("Create report error:", error);
      res.status(500).json({
        success: false,
        error: "Terjadi kesalahan saat membuat laporan",
      });
    }
  },
);

router.get(
  "/me",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const reports = await getPrisma().report.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          imageUrl: true,
          latitude: true,
          longitude: true,
          address: true,
          description: true,
          status: true,
          upvotes: true,
          createdAt: true,
        },
      });

      res.status(200).json({
        success: true,
        data: {
          reports: reports.map((report) => ({
            ...report,
            pointsEarned: REPORT_POINTS,
          })),
        },
      });
    } catch (error) {
      console.error("Get reports error:", error);
      res.status(500).json({
        success: false,
        error: "Terjadi kesalahan saat mengambil laporan",
      });
    }
  },
);

export default router;
