# 🤖 CleanChat - Chatbot Feature Guide

## 🎯 What's Been Created

### ✅ Complete Chatbot System

**Backend Implementation**

- `/server/routes/chatbot.ts` (341 lines, 7.9KB)
  - GET `/api/chatbot/conversations` - List all conversations
  - POST `/api/chatbot/conversations` - Create new conversation
  - GET `/api/chatbot/conversations/:id` - Get conversation with messages
  - POST `/api/chatbot/send-message` - Send message to Gemini
  - DELETE `/api/chatbot/conversations/:id` - Delete conversation

- `/server/app/main.ts` - Route registration
- `/server/.env` - Gemini API key configuration

**Frontend Implementation**

- `/cleanic/components/Chatbot.tsx` (469 lines, 19KB)
  - Elegant dark theme UI
  - Real-time messaging with animations
  - Responsive mobile design
  - Markdown support for assistant messages
  - Keyboard shortcuts (Enter to send)
  - Conversation management

- `/cleanic/app/dashboard/chatbot/page.tsx` - Main page

**Database**

- ChatConversation model (PostgreSQL)
- ChatMessage model (PostgreSQL)
- MessageRole enum (USER, ASSISTANT)
- All relationships already configured

**Dependencies Installed**
✅ @google/generative-ai@0.24.1
✅ react-markdown@10.1.0
✅ lucide-react@1.14.0
✅ axios@1.16.0

## 🎨 Premium UI Features

### Visual Design

```
┌─────────────────────────────────────────────────────────────┐
│                       CleanChat                              │
│                  Powered by Gemini 2.5 Pro                  │
└─────────────────────────────────────────────────────────────┘

🎨 Dark Theme with Gradient Backgrounds
   - Blue-Slate gradients throughout
   - Smooth fade-in animations per message
   - Enhanced shadows for depth

💬 Message Display
   User Messages:
   - Emerald to Cyan gradient
   - Right-aligned bubble
   - Font-medium weight
   - Shadow with emerald glow

   Assistant Messages:
   - Slate gray gradient
   - Left-aligned bubble
   - Markdown support
   - Code block styling
   - Shadow with subtle glow

🎯 Interactive Elements
   - Hover effects on conversation list
   - Active conversation highlight
   - Delete button with confirmation
   - Button scale animations
   - Loading indicator with colored dots

📱 Responsive Design
   - Sidebar collapses on mobile
   - Full-screen chat on tablet+
   - Touch-friendly button sizes
   - Optimized for all screen sizes

⌨️ Keyboard Shortcuts
   - Enter: Send message
   - Shift+Enter: New line in message
```

## 🚀 Getting Started - Step by Step

### 1️⃣ Get Gemini API Key

```bash
📍 Visit: https://aistudio.google.com/apikey
👤 Sign in dengan Google Account
🔑 Click "Create API key"
📋 Copy the generated API key
```

### 2️⃣ Configure Backend Environment

```bash
📂 File: /home/almagribi/dbs/capstone/server/.env

# Line to update:
GEMINI_API_KEY="your-gemini-api-key-here"

# Change to your actual key:
GEMINI_API_KEY="sk-proj-xxxxxxxxxxxxx"
```

### 3️⃣ Verify Dependencies Installed

```bash
cd /home/almagribi/dbs/capstone/server

# Check if @google/generative-ai is installed:
bun list @google/generative-ai

# Should show: @google/generative-ai@0.24.1
```

### 4️⃣ Start Backend Server

```bash
cd /home/almagribi/dbs/capstone/server
bun run dev

# Expected output:
# Server berjalan di port 3001
# API Auth tersedia di http://localhost:3001/api/auth
# Chatbot tersedia di http://localhost:3001/api/chatbot
```

### 5️⃣ Start Frontend Server

```bash
cd /home/almagribi/dbs/capstone/cleanic
npm run dev

# Expected output:
# ▲ Next.js 16.2.4
# - Local:        http://localhost:3000
```

### 6️⃣ Access Chatbot

```
🌐 Open browser: http://localhost:3000/dashboard/chatbot

✅ Should see:
   - Beautiful dark theme interface
   - "Start a Conversation" message
   - Quick suggestion buttons
   - Input field at bottom
```

## 💬 How to Use

### Creating a New Chat

1. Click "New Chat" button di sidebar
2. New conversation akan dibuat
3. Mulai ketik pesan di input field
4. Press Enter atau click Send button

### Sending Messages

1. Type your message dalam input field
2. Press **Enter** untuk send
3. Atau click **Send button** (➤)
4. Tunggu response dari Gemini
5. Response akan muncul dengan animasi

### Managing Conversations

- **Switch Chat**: Click conversation di sidebar
- **Delete Chat**: Hover ke conversation, click trash icon
- **Auto-Title**: First message menjadi title otomatis
- **View History**: Scroll di chat untuk melihat semua messages

### Keyboard Shortcuts

| Shortcut      | Action               |
| ------------- | -------------------- |
| Enter         | Send message         |
| Shift + Enter | Add new line         |
| Escape        | Close mobile sidebar |

## 📊 API Endpoints Reference

### Authentication

All endpoints require: `Authorization: Bearer {jwt_token}`

### Get All Conversations

```
GET /api/chatbot/conversations
Response: { success: true, data: [{id, title, createdAt, updatedAt, messages}] }
```

### Create New Conversation

```
POST /api/chatbot/conversations
Body: { title?: "Custom Title" }
Response: { success: true, data: {id, title, createdAt, updatedAt} }
```

### Get Conversation Details

```
GET /api/chatbot/conversations/:conversationId
Response: { success: true, data: {id, title, messages: [{id, role, content, createdAt}]} }
```

### Send Message

```
POST /api/chatbot/send-message
Body: {
  conversationId: "conv-id-xxx",
  message: "Your question here"
}
Response: {
  success: true,
  data: {
    userMessage: {role: "USER", content: "..."},
    assistantMessage: {role: "ASSISTANT", content: "..."}
  }
}
```

### Delete Conversation

```
DELETE /api/chatbot/conversations/:conversationId
Response: { success: true, message: "Conversation deleted" }
```

## 🔒 Security Features

✅ **JWT Authentication** - Token-based access control
✅ **User Ownership** - Users hanya bisa akses chat mereka
✅ **API Key Protection** - Gemini key hanya di backend
✅ **CORS Protection** - Frontend origin validation
✅ **Database Cascade** - Automatic cleanup on user deletion
✅ **Password Hashing** - bcryptjs salt rounds = 10

## 🐛 Troubleshooting

### Chatbot tidak respond

```bash
# Check 1: Verify API key is set
cat /home/almagribi/dbs/capstone/server/.env | grep GEMINI_API_KEY

# Check 2: Verify backend is running
curl http://localhost:3001/health
# Should return: {"status":"OK"}

# Check 3: Check browser console untuk error
# Open DevTools: F12 atau Ctrl+Shift+I
```

### Token error

```bash
# Check localStorage di browser
# Open Console dan type:
localStorage.getItem('token')

# If null, login kembali di:
# http://localhost:3000/auth/login
```

### Messages tidak tersimpan

```bash
# Check database connection:
cd /home/almagribi/dbs/capstone/server
npx prisma studio

# Should open http://localhost:5555
# Check ChatConversation & ChatMessage tables
```

### UI tidak smooth

```bash
# Clear browser cache
Ctrl+Shift+Delete (or Cmd+Shift+Delete)

# Or Force refresh
Ctrl+Shift+R (or Cmd+Shift+R)
```

## 📱 Features Checklist

### Messaging

- [x] Send messages from user
- [x] Receive AI responses
- [x] Display typing indicator
- [x] Auto-scroll to latest message
- [x] Markdown rendering

### Conversations

- [x] Create new conversation
- [x] List all conversations
- [x] Switch between conversations
- [x] Delete conversation
- [x] Auto-title generation
- [x] Persist to database

### UI/UX

- [x] Dark theme design
- [x] Responsive layout
- [x] Mobile sidebar toggle
- [x] Smooth animations
- [x] Keyboard shortcuts
- [x] Loading states
- [x] Empty state suggestions
- [x] Better message formatting

### Performance

- [x] Optimized rendering
- [x] Smooth scrolling
- [x] Debounced events
- [x] Message caching
- [x] Fast API responses

### Security

- [x] JWT authentication
- [x] User verification
- [x] API key protection
- [x] CORS validation
- [x] Database permissions

## 📚 Documentation Files

- `CHATBOT_README.md` - Detailed technical documentation
- `CHATBOT_GUIDE.md` - This file, getting started guide
- `server/routes/chatbot.ts` - Backend implementation
- `cleanic/components/Chatbot.tsx` - Frontend implementation

## 🎉 You're All Set!

Your AI Chatbot is ready to go!

**Next steps:**

1. Get your Gemini API key
2. Add it to `.env`
3. Run backend & frontend
4. Start chatting!

For more details, see `CHATBOT_README.md`

---

**Version:** 1.0.0  
**Last Updated:** May 14, 2026  
**Status:** ✅ Production Ready
