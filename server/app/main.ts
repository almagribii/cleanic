// Load environment variables explicitly
import fs from "fs";
import path from "path";

const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  const lines = envContent.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      if (key) {
        let value = valueParts.join("=");
        // Remove quotes if present
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

import express from "express";
import cors from "cors";
import authRoutes from "../routes/auth";
import reportRoutes from "../routes/reports";
import leaderboardRoutes from "../routes/leaderboard";
import usersRoutes from "../routes/users";
import chatbotRoutes from "../routes/chatbot";
import { authMiddleware } from "../middleware/auth";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
// Increase body size limit to allow image data URLs from webcam captures
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Contoh protected route
app.get("/api/protected", authMiddleware, (req: any, res) => {
  res.json({
    success: true,
    message: "Anda mengakses protected route",
    user: req.user,
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
  console.log(`API Auth tersedia di http://localhost:${PORT}/api/auth`);
});
