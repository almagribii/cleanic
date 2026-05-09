# Authentication System Documentation

## 📋 Overview

Sistem authentikasi lengkap menggunakan Express, JWT, dan bcryptjs dengan Prisma sebagai ORM.

## 🛠 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

Copy `.env.example` ke `.env` dan update nilai:

```bash
cp .env.example .env
```

Pastikan `JWT_SECRET` sudah diubah di production.

### 3. Database Migration

```bash
npx prisma migrate dev
```

## 🔐 Authentication Endpoints

### Register User

**POST** `/api/auth/register`

```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "image": null
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Login User

**POST** `/api/auth/login`

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "image": null,
      "points": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Get Current User

**GET** `/api/auth/me`

Headers:
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "image": null,
      "points": 0,
      "createdAt": "2026-05-09T10:00:00Z"
    }
  }
}
```

### Logout User

**POST** `/api/auth/logout`

Headers:
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

### Refresh Token

**POST** `/api/auth/refresh-token`

Headers:
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token berhasil di-refresh",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

## 🔒 Using Protected Routes

### Server Side (Express)

```typescript
import { authMiddleware } from "./middleware/auth";

app.get("/api/protected", authMiddleware, (req, res) => {
  const userId = req.user?.id;
  // Lakukan sesuatu dengan userId
  res.json({ message: "Protected resource", userId });
});
```

### Client Side (Axios/Fetch)

```typescript
// Simpan token dari response login
const token = response.data.data.token;
localStorage.setItem("token", token);

// Gunakan token di setiap request
const headers = {
  Authorization: `Bearer ${token}`,
};

// Dengan Axios
axios.get("/api/auth/me", { headers });

// Dengan Fetch
fetch("/api/auth/me", {
  headers,
});
```

## 📁 Project Structure

```
server/
├── lib/
│   └── auth.ts              # Auth utilities (hash, JWT)
├── middleware/
│   └── auth.ts              # Auth middleware
├── routes/
│   └── auth.ts              # Auth endpoints
├── types/
│   └── index.ts             # TypeScript types
├── app/
│   └── main.ts              # Express app setup
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
├── .env                     # Environment variables
├── .env.example             # Environment template
└── package.json
```

## 🔑 Key Features

- ✅ Password hashing dengan bcryptjs (salt: 10)
- ✅ JWT token generation & verification
- ✅ User registration & login
- ✅ Protected routes dengan middleware
- ✅ Token refresh endpoint
- ✅ TypeScript support
- ✅ Error handling
- ✅ Email validation (basic)

## ⚙️ Security Best Practices

1. **JWT_SECRET**: Gunakan string yang kuat dan panjang di production
2. **HTTPS**: Pastikan semua komunikasi menggunakan HTTPS di production
3. **Token Expiry**: Default 7 hari, bisa disesuaikan di `lib/auth.ts`
4. **Password**: Gunakan bcryptjs salt 10 (sudah dikonfigurasi)
5. **Rate Limiting**: Tambahkan rate limiting untuk login/register endpoints
6. **CORS**: Konfigurasi CORS dengan domain yang spesifik
7. **Env Variables**: Jangan commit `.env` ke git, gunakan `.env.example`

## 🧪 Testing dengan cURL

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456",
    "name": "Test User"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'

# Get current user (ganti TOKEN dengan token dari login)
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer TOKEN"

# Logout
curl -X POST http://localhost:3001/api/auth/logout \
  -H "Authorization: Bearer TOKEN"
```

## 🚀 Next Steps

1. Install dependencies: `npm install`
2. Setup `.env` file
3. Run migrations: `npx prisma migrate dev`
4. Start server: `npm run dev` (pastikan ada script di package.json)
5. Test endpoints dengan cURL atau Postman

## 📝 Notes

- Schema User sudah memiliki `password` field yang cocok untuk menyimpan hash
- Session model bisa digunakan untuk session management tambahan
- Account model untuk social login (OAuth) di masa depan
