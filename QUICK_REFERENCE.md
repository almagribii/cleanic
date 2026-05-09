# 🔐 Authentication Quick Reference

## 🏃 Quick Start (5 minutes)

```bash
# 1. Install dependencies
cd server && npm install

# 2. Setup environment
cp .env.example .env
# Edit .env and set JWT_SECRET

# 3. Database migration
npx prisma migrate dev

# 4. Start server
npm run dev
# Server runs at http://localhost:3001

# 5. Setup frontend
cd ../cleanic
# Add to app/layout.tsx:
# <AuthProvider>{children}</AuthProvider>

npm run dev
# Frontend runs at http://localhost:3000
```

## 📡 API Quick Commands

### Register
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"pass123","name":"John"}'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"pass123"}'
# Save token from response
```

### Get User (replace TOKEN)
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Logout
```bash
curl -X POST http://localhost:3001/api/auth/logout \
  -H "Authorization: Bearer TOKEN"
```

## 💻 Frontend Code Snippets

### Use Auth Hook
```typescript
import { useAuth } from "@/hooks/useAuth";

export function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Hello, {user?.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login("user@test.com", "pass123")}>Login</button>
      )}
    </div>
  );
}
```

### Protect Route
```typescript
import { ProtectedRoute } from "@/hooks/useAuth";

export default function DashboardPage() {
  return (
    <ProtectedRoute redirectTo="/login">
      <Dashboard />
    </ProtectedRoute>
  );
}
```

### Login Form Usage
```typescript
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return <LoginForm />;
}
```

## 🔑 Backend Code Snippets

### Protected Endpoint
```typescript
import { authMiddleware } from "./middleware/auth";

app.get("/api/protected", authMiddleware, (req, res) => {
  const userId = req.user?.id;
  res.json({ message: "Protected resource", userId });
});
```

### Get User Info
```typescript
import { getUserById } from "./lib/user";

const user = await getUserById(userId);
```

### Add User Points
```typescript
import { addUserPoints } from "./lib/user";

await addUserPoints(userId, 10); // Add 10 points
```

## 📁 File Structure Reference

```
server/
├── lib/
│   ├── auth.ts              # JWT & password utils
│   └── user.ts              # User database queries
├── middleware/
│   └── auth.ts              # Auth middleware
├── routes/
│   └── auth.ts              # Auth endpoints
├── types/
│   └── index.ts             # TypeScript types
├── app/
│   └── main.ts              # Express setup
└── prisma/
    └── schema.prisma        # DB schema

cleanic/
├── hooks/
│   └── useAuth.ts           # Auth React hook
└── components/
    ├── LoginForm.tsx        # Login form
    └── RegisterForm.tsx     # Register form
```

## ⚙️ Environment Variables

```env
# Server
DATABASE_URL=postgresql://user:pass@localhost:5432/cleanic
JWT_SECRET=your-secret-key-change-in-production
PORT=3001
NODE_ENV=development

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🚨 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Module not found" | Run `npm install` |
| "Can't connect to server" | Check if server is running on port 3001 |
| "JWT_SECRET not found" | Add JWT_SECRET to `.env` |
| "Token expired" | Call `refreshToken()` endpoint |
| "Unauthorized" | Check if token is valid and not expired |
| "CORS error" | Update CORS_ORIGIN in server/app/main.ts |

## 📚 Key Files to Know

| File | Purpose |
|------|---------|
| `server/lib/auth.ts` | Generate & verify tokens, hash passwords |
| `server/routes/auth.ts` | Auth API endpoints |
| `cleanic/hooks/useAuth.ts` | React state management for auth |
| `server/.env` | API credentials (DO NOT COMMIT) |
| `server/prisma/schema.prisma` | Database schema |

## 🔐 Security Checklist

- [ ] Changed JWT_SECRET in `.env`
- [ ] Using strong password requirements
- [ ] HTTPS enabled in production
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Environment variables secured
- [ ] Database backups configured
- [ ] Logging enabled for security events

## 🧪 Test Cases

1. Register with new email ✅
2. Login with correct credentials ✅
3. Try login with wrong password ❌
4. Try login with non-existent email ❌
5. Access protected route without token ❌
6. Access protected route with valid token ✅
7. Logout and verify token doesn't work ✅
8. Refresh token and get new token ✅

## 📞 Documentation Links

- Full Auth Docs: [AUTH_README.md](./server/AUTH_README.md)
- Setup Guide: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- Prisma Docs: https://www.prisma.io/docs/
- JWT Info: https://jwt.io/
- bcryptjs: https://github.com/dcodeIO/bcrypt.js
