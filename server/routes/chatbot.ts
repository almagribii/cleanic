import { Router, Response, Request } from "express";
import { authMiddleware } from "../middleware/auth";
import { getPrisma } from "../lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

interface ChatMessage {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

const GEMINI_MODELS = ["gemini-2.5-pro", "gemini-2.5-flash"];
const GEMINI_SYSTEM_INSTRUCTION = `Anda adalah asisten AI umum yang membantu menjawab berbagai pertanyaan pengguna secara jelas, ramah, dan akurat.

Aturan respon:
- Jawab sesuai pertanyaan user dan gunakan konteks percakapan jika ada.
- Utamakan bahasa Indonesia.
- Jika user memulai dengan bahasa Inggris, balas dalam bahasa Inggris.
- Berikan jawaban yang ringkas, natural, dan membantu.
- Jika pertanyaan pengguna kurang jelas, minta klarifikasi secara singkat.
- Jika diminta membuat rekomendasi atau saran, berikan langkah yang praktis.`;

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * GET /chatbot/conversations
 * Get all conversations untuk user yang login
 */
router.get(
  "/conversations",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
        return;
      }

      const conversations = await getPrisma().chatConversation.findMany({
        where: { userId },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { updatedAt: "desc" },
      });

      res.status(200).json({
        success: true,
        data: conversations,
      });
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch conversations",
      });
    }
  },
);

/**
 * POST /chatbot/conversations
 * Create new conversation
 */
router.post(
  "/conversations",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { title } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
        return;
      }

      const conversation = await getPrisma().chatConversation.create({
        data: {
          userId,
          title: title || "New Conversation",
        },
      });

      res.status(201).json({
        success: true,
        data: conversation,
      });
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create conversation",
      });
    }
  },
);

/**
 * PATCH /chatbot/conversations/:id
 * Update conversation title
 */
router.patch(
  "/conversations/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const id = String(req.params.id);
      const { title } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
        return;
      }

      const trimmedTitle = typeof title === "string" ? title.trim() : "";

      if (!trimmedTitle) {
        res.status(400).json({
          success: false,
          error: "Title is required",
        });
        return;
      }

      const conversation = await getPrisma().chatConversation.findUnique({
        where: { id },
      });

      if (!conversation || conversation.userId !== userId) {
        res.status(404).json({
          success: false,
          error: "Conversation not found",
        });
        return;
      }

      const updatedConversation = await getPrisma().chatConversation.update({
        where: { id },
        data: { title: trimmedTitle },
      });

      res.status(200).json({
        success: true,
        data: updatedConversation,
      });
    } catch (error) {
      console.error("Error updating conversation title:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update conversation title",
      });
    }
  },
);

/**
 * POST /chatbot/conversations/:id/title
 * Update conversation title with a POST request for better client compatibility
 */
router.post(
  "/conversations/:id/title",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const id = String(req.params.id);
      const { title } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
        return;
      }

      const trimmedTitle = typeof title === "string" ? title.trim() : "";

      if (!trimmedTitle) {
        res.status(400).json({
          success: false,
          error: "Title is required",
        });
        return;
      }

      const conversation = await getPrisma().chatConversation.findUnique({
        where: { id },
      });

      if (!conversation || conversation.userId !== userId) {
        res.status(404).json({
          success: false,
          error: "Conversation not found",
        });
        return;
      }

      const updatedConversation = await getPrisma().chatConversation.update({
        where: { id },
        data: { title: trimmedTitle },
      });

      res.status(200).json({
        success: true,
        data: updatedConversation,
      });
    } catch (error) {
      console.error("Error updating conversation title:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update conversation title",
      });
    }
  },
);

/**
 * GET /chatbot/conversations/:id
 * Get specific conversation with all messages
 */
router.get(
  "/conversations/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const id = String(req.params.id);

      if (!userId) {
        res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
        return;
      }

      const conversation = await getPrisma().chatConversation.findUnique({
        where: { id },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (!conversation || conversation.userId !== userId) {
        res.status(404).json({
          success: false,
          error: "Conversation not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: conversation,
      });
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch conversation",
      });
    }
  },
);

/**
 * POST /chatbot/send-message
 * Send message dan get response dari Gemini
 */
router.post(
  "/send-message",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { conversationId, message } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
        return;
      }

      if (!conversationId || !message) {
        res.status(400).json({
          success: false,
          error: "Conversation ID dan message diperlukan",
        });
        return;
      }

      if (!process.env.GEMINI_API_KEY) {
        res.status(500).json({
          success: false,
          error: "Gemini API key tidak dikonfigurasi",
        });
        return;
      }

      // Verifikasi ownership conversation
      const conversation = await getPrisma().chatConversation.findUnique({
        where: { id: conversationId },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (!conversation || conversation.userId !== userId) {
        res.status(403).json({
          success: false,
          error: "Forbidden",
        });
        return;
      }

      // Save user message ke database
      await getPrisma().chatMessage.create({
        data: {
          conversationId,
          role: "USER",
          content: message,
        },
      });

      const recentMessages = conversation.messages.slice(-8);
      const conversationContext = recentMessages.length
        ? recentMessages
            .map(
              (msg) =>
                `${msg.role === "USER" ? "User" : "Assistant"}: ${msg.content}`,
            )
            .join("\n")
        : "Belum ada konteks percakapan sebelumnya.";

      const prompt = `${GEMINI_SYSTEM_INSTRUCTION}\n\nKonteks percakapan terakhir:\n${conversationContext}\n\nPertanyaan user saat ini:\n${message}\n\nJawab langsung pertanyaan user saat ini secara spesifik. Jangan mengulang sapaan umum jika user sudah bertanya sesuatu yang jelas.`;

      // Get response dari Gemini
      let responseText = "";
      let lastGeminiError: unknown = null;

      for (const modelName of GEMINI_MODELS) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              maxOutputTokens: 1024,
              temperature: 0.4,
            },
          });

          responseText =
            result.response.text() ||
            "Maaf, saya tidak bisa merespons pertanyaan Anda.";
          break;
        } catch (geminiError) {
          lastGeminiError = geminiError;
          console.error(`Gemini model ${modelName} failed:`, geminiError);
        }
      }

      if (!responseText) {
        console.error("Gemini error, using general fallback:", lastGeminiError);

        responseText =
          "Maaf, saya sedang kesulitan memproses jawaban. Coba tanyakan lagi dengan lebih spesifik, dan saya akan bantu sebisa mungkin.";
      }

      // Save assistant response ke database
      const assistantMessage = await getPrisma().chatMessage.create({
        data: {
          conversationId,
          role: "ASSISTANT",
          content: responseText,
        },
      });

      // Update conversation title jika belum ada judul custom
      if (
        conversation.title === "New Conversation" ||
        !conversation.title ||
        conversation.title.length === 0
      ) {
        const titlePrompt = message.substring(0, 50);
        await getPrisma().chatConversation.update({
          where: { id: conversationId },
          data: { title: titlePrompt },
        });
      }

      res.status(200).json({
        success: true,
        data: {
          userMessage: {
            role: "USER",
            content: message,
          },
          assistantMessage: {
            role: "ASSISTANT",
            content: responseText,
          },
        },
      });
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send message";
      res.status(500).json({
        success: false,
        error: errorMessage,
      });
    }
  },
);

/**
 * DELETE /chatbot/conversations/:id
 * Delete conversation
 */
router.delete(
  "/conversations/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const id = String(req.params.id);

      if (!userId) {
        res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
        return;
      }

      const conversation = await getPrisma().chatConversation.findUnique({
        where: { id },
      });

      if (!conversation || conversation.userId !== userId) {
        res.status(403).json({
          success: false,
          error: "Forbidden",
        });
        return;
      }

      await getPrisma().chatConversation.delete({
        where: { id },
      });

      res.status(200).json({
        success: true,
        message: "Conversation deleted",
      });
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete conversation",
      });
    }
  },
);

export default router;
