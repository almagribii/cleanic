# 🔐 Setup Guide Authentikasi Lengkap - Cleanic

## 📦 File yang Telah Dibuat

### Server-side (Backend)
1. **lib/auth.ts** - Utility untuk password hashing dan JWT
2. **lib/user.ts** - Utility untuk database queries user
3. **middleware/auth.ts** - Middleware untuk protect routes
4. **routes/auth.ts** - Auth endpoints (register, login, logout, etc)
5. **types/index.ts** - TypeScript interfaces untuk auth
6. **.env.example** - Template environment variables
7. **AUTH_README.md** - Dokumentasi auth system

### Client-side (Frontend)
1. **hooks/useAuth.ts** - React hook untuk auth management
2. **components/LoginForm.tsx** - Contoh login form
3. **components/RegisterForm.tsx** - Contoh register form

## 🚀 Step-by-Step Setup

### 1️⃣ Install Backend Dependencies

```bash
cd server
npm install
```

Atau jika menggunakan bun:
```bash
bun install
```

### 2️⃣ Setup Environment Variables

```bash
cd server
cp .env.example .env
```

Buka file `.env` dan update:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/cleanic"
JWT_SECRET="ganti-dengan-secret-key-yang-kuat-12345678901234"
PORT=3001
FRONTEND_URL="http://localhost:3000"
NODE_ENV="development"
```

**PENTING**: 
- Ubah `JWT_SECRET` dengan nilai yang kuat dan random
- Pastikan `DATABASE_URL` sesuai dengan koneksi database Anda

### 3️⃣ Update Database dengan Migration

```bash
cd server
npx prisma migrate dev --name "add_auth_schema"
```

Atau jika sudah ada migration yang pending:
```bash
npx prisma migrate deploy
```

### 4️⃣ Verifikasi Database Schema

Buka Prisma Studio untuk melihat database:
```bash
npx prisma studio
```

### 5️⃣ Update Server Main File

Di `server/app/main.ts`, pastikan import auth routes:

```typescript
import authRoutes from "./routes/auth";
app.use("/api/auth", authRoutes);
```

### 6️⃣ Update Frontend - Setup Environment

Di `cleanic/.env.local` (atau `.env`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 7️⃣ Wrap App dengan AuthProvider

Di `cleanic/app/layout.tsx`:

```typescript
import { AuthProvider } from "@/hooks/useAuth";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 8️⃣ Jalankan Server

```bash
cd server
npm run dev
```

Server akan berjalan di `http://localhost:3001`

### 9️⃣ Jalankan Frontend

Di terminal baru:
```bash
cd cleanic
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

## 🧪 Testing Authentication

### Test dengan cURL

**Register User:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Response akan berisi `token`, simpan untuk test endpoint lain.

**Get Current User:**
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer <TOKEN_DARI_LOGIN>"
```

### Test dengan Postman

1. Import collection dari [postman-collection.json](./postman-collection.json)
2. Set environment variable `token` dari response login
3. Test semua endpoint

## 📱 Menggunakan Auth di Frontend Components

### Login Component

```typescript
"use client";

import { useAuth } from "@/hooks/useAuth";

export function LoginPage() {
  const { login, error, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
      // Redirect ke dashboard
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
      {/* Form inputs */}
    </form>
  );
}
```

### Protected Component

```typescript
import { ProtectedRoute } from "@/hooks/useAuth";
import Dashboard from "@/app/dashboard";

export default function ProtectedPage() {
  return (
    <ProtectedRoute redirectTo="/login">
      <Dashboard />
    </ProtectedRoute>
  );
}
```

### Akses User Info

```typescript
"use client";

import { useAuth } from "@/hooks/useAuth";

export function UserProfile() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Silakan login</div>;
  }

  return (
    <div>
      <h1>Halo, {user?.name}</h1>
      <p>Email: {user?.email}</p>
      <p>Points: {user?.points}</p>
    </div>
  );
}
```

## 🔧 API Endpoints Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Registrasi user baru |
| POST | `/api/auth/login` | ❌ | Login dengan email & password |
| GET | `/api/auth/me` | ✅ | Get current user info |
| POST | `/api/auth/logout` | ✅ | Logout user |
| POST | `/api/auth/refresh-token` | ✅ | Refresh JWT token |

## 📋 Struktur Database

User model sudah memiliki:
- ✅ `id` (UUID primary key)
- ✅ `email` (unique)
- ✅ `password` (untuk menyimpan hashed password)
- ✅ `name`
- ✅ `image`
- ✅ `points` (untuk gamification)
- ✅ `createdAt` & `updatedAt`

Relasi:
- User → Accounts (untuk OAuth)
- User → Sessions (untuk session management)
- User → WasteScan, Report, Vote, ChatConversation

## 🛡️ Security Notes

1. **Password Hashing**: Menggunakan bcryptjs dengan salt=10
2. **JWT**: Default expiry 7 hari
3. **Token Storage**: Di localStorage (bisa upgrade ke httpOnly cookies)
4. **Rate Limiting**: Belum diimplementasi, perlu ditambahkan untuk production
5. **HTTPS**: Gunakan HTTPS di production, bukan HTTP
6. **CORS**: Update CORS_ORIGIN dengan domain frontend Anda

## 🐛 Troubleshooting

### Error: "Module not found: bcryptjs"
```bash
npm install bcryptjs @types/bcryptjs
```

### Error: "Cannot find module '@/hooks/useAuth'"
Pastikan path alias `@/` sudah dikonfigurasi di `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Error: "NEXT_PUBLIC_API_URL is not defined"
Pastikan `.env.local` sudah dibuat dengan `NEXT_PUBLIC_API_URL`

### Error: "Can't reach server"
- Pastikan server berjalan di port 3001
- Pastikan CORS sudah dikonfigurasi
- Check firewall settings

## 📚 Next Steps

1. Tambah email verification
2. Tambah password reset functionality
3. Implementasi OAuth (Google, GitHub)
4. Tambah rate limiting untuk login attempts
5. Setup logging dan monitoring
6. Migrasi token storage ke httpOnly cookies
7. Implementasi 2FA (Two-Factor Authentication)
8. Audit security dengan tools seperti OWASP ZAP

## 📞 Support

Untuk pertanyaan lebih lanjut, lihat:
- [AUTH_README.md](./AUTH_README.md) - Dokumentasi lengkap auth system
- [Prisma Docs](https://www.prisma.io/docs/) - Database ORM
- [JWT.io](https://jwt.io/) - JWT Debugger & Info
- [bcryptjs Docs](https://github.com/dcodeIO/bcrypt.js) - Password hashing
