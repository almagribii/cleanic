# 🤖 CleanChat - AI Chatbot Documentation

## Overview

CleanChat adalah AI Chatbot terintegrasi menggunakan Google Gemini 2.5 Pro yang membantu pengguna dengan informasi tentang waste management, recycling, dan sustainability.

## 🚀 Features

### Frontend Features

- ✨ **Elegant Dark Theme UI** - Modern design dengan gradient backgrounds
- 💬 **Real-time Messaging** - Instant message display dengan smooth animations
- 📱 **Responsive Design** - Perfectly optimized untuk mobile, tablet, dan desktop
- 🎨 **Beautiful Message Bubbles** - Differentiated styling untuk user dan assistant messages
- 📝 **Markdown Support** - Assistant messages mendukung formatting, lists, code blocks
- 🔔 **Typing Indicator** - Animated loading state dengan "Thinking..." indicator
- 💾 **Conversation History** - Multiple conversations dengan auto-title generation
- 🗑️ **Conversation Management** - Delete conversations dengan confirmation dialog
- ⌨️ **Keyboard Shortcuts** - Enter to send, Shift+Enter for new line
- 🎯 **Quick Start Suggestions** - Empty state dengan suggested questions

### Backend Features

- 🔐 **JWT Authentication** - Secure API endpoints with auth middleware
- 💾 **Database Persistence** - All conversations saved to PostgreSQL
- 🧠 **Gemini Integration** - Google Gemini 2.5 Pro AI model
- 📜 **Chat History Context** - Maintains conversation context untuk better responses
- 🏷️ **Auto Title Generation** - Automatic title dari first message
- ⚡ **Full CRUD Operations** - Create, read, update, delete conversations

## 🔧 Setup Instructions

### 1. Get Gemini API Key

1. Go to: https://aistudio.google.com/apikey
2. Sign in dengan Google Account
3. Click "Create API key"
4. Copy the API key

### 2. Configure Backend Environment

Update `/server/.env`:

```env
GEMINI_API_KEY="your-actual-gemini-api-key-here"
```

### 3. Run Backend Server

```bash
cd /home/almagribi/dbs/capstone/server
bun run dev
```

Server akan berjalan di `http://localhost:3001`

### 4. Run Frontend

```bash
cd /home/almagribi/dbs/capstone/cleanic
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

### 5. Access Chatbot

Navigate to: `http://localhost:3000/dashboard/chatbot`

## 📋 API Endpoints

### Base URL

`http://localhost:3001/api/chatbot`

### Endpoints

#### 1. Get All Conversations

```
GET /conversations
Headers: Authorization: Bearer {token}
Response: { success: true, data: Conversation[] }
```

#### 2. Create New Conversation

```
POST /conversations
Headers: Authorization: Bearer {token}
Body: { title?: string }
Response: { success: true, data: Conversation }
```

#### 3. Get Specific Conversation

```
GET /conversations/:id
Headers: Authorization: Bearer {token}
Response: { success: true, data: Conversation with messages }
```

#### 4. Send Message

```
POST /send-message
Headers: Authorization: Bearer {token}
Body: { conversationId: string, message: string }
Response: { success: true, data: { userMessage, assistantMessage } }
```

#### 5. Delete Conversation

```
DELETE /conversations/:id
Headers: Authorization: Bearer {token}
Response: { success: true, message: "Conversation deleted" }
```

## 📊 Database Schema

### ChatConversation Model

```prisma
model ChatConversation {
  id        String    @id @default(uuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  title     String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  messages  ChatMessage[]
}
```

### ChatMessage Model

```prisma
model ChatMessage {
  id             String           @id @default(uuid())
  conversationId String
  conversation   ChatConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  role           MessageRole      # USER | ASSISTANT
  content        String           @db.Text
  createdAt      DateTime         @default(now())
}
```

## 🎨 UI Components

### Main Chat Container

- Full-screen responsive layout
- Dark theme dengan blue-slate gradient
- Smooth animations dan transitions

### Sidebar

- Conversation list dengan scroll
- New Chat button dengan gradient
- Delete button with hover effects
- Active conversation highlight

### Message Display

- User messages: Emerald-Cyan gradient, right-aligned
- Assistant messages: Slate gray, left-aligned dengan markdown support
- Smooth fade-in animations per message
- Typing indicator saat loading

### Input Area

- Fixed at bottom dengan backdrop blur
- Support untuk keyboard shortcuts
- Real-time character count
- Disabled state saat loading

## ⌨️ Keyboard Shortcuts

| Shortcut    | Action                 |
| ----------- | ---------------------- |
| Enter       | Send message           |
| Shift+Enter | New line dalam message |
| Escape      | Close sidebar (mobile) |

## 🔒 Security

- ✅ JWT token-based authentication
- ✅ User ownership verification untuk setiap conversation
- ✅ API key tidak terekspos ke frontend
- ✅ CORS protection
- ✅ Password hashing dengan bcryptjs

## 🐛 Troubleshooting

### Chatbot tidak merespons

- Check GEMINI_API_KEY di `.env`
- Verify backend server running di port 3001
- Check browser console untuk error messages

### Messages tidak tersimpan

- Verify database connection
- Check user authentication token
- Ensure JWT_SECRET configured

### UI tidak smooth

- Clear browser cache
- Update React dan dependencies
- Check browser compatibility

## 📦 Dependencies

### Backend

```json
{
  "@google/generative-ai": "^0.24.1",
  "@prisma/client": "^5.0.0",
  "express": "^5.2.1",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3"
}
```

### Frontend

```json
{
  "react": "19.2.4",
  "next": "16.2.4",
  "axios": "^1.16.0",
  "react-markdown": "^10.1.0",
  "lucide-react": "^1.14.0"
}
```

## 🚀 Performance Tips

1. **Message Caching** - Conversations cached di localStorage
2. **Lazy Loading** - Messages loaded as needed
3. **Optimized Rendering** - React.memo untuk messages
4. **Smooth Scrolling** - Auto-scroll to latest message dengan timeout
5. **Debounced Resize** - Window resize events debounced

## 📱 Mobile Optimization

- Responsive grid layout untuk quick suggestions
- Touch-friendly button sizes (min 44x44px)
- Sidebar auto-collapse pada mobile
- Optimized input area untuk mobile keyboards
- Full-height design tanpa overflow

## 🔄 Future Enhancements

- [ ] Voice input/output
- [ ] Image sharing dalam chat
- [ ] Export conversations
- [ ] Search conversations
- [ ] Rate limiting
- [ ] User preferences
- [ ] Multi-language support
- [ ] Chat statistics

## 📞 Support

Untuk issues atau pertanyaan, hubungi team development.

---

**Last Updated:** May 14, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
