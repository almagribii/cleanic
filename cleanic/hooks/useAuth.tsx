"use client";

/**
 * Client-side Hook untuk Authentication di React/Next.js
 * Letakkan file ini di: cleanic/hooks/useAuth.ts
 */

import { useState, useEffect, useCallback, useContext, createContext } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  points?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Hook untuk menggunakan auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
}

/**
 * Provider component untuk auth
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load token dari localStorage saat mount
  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Login gagal");
        }

        const { token: newToken, user: userData } = data.data;

        setToken(newToken);
        setUser(userData);

        // Simpan ke localStorage
        localStorage.setItem("auth_token", newToken);
        localStorage.setItem("auth_user", JSON.stringify(userData));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Login error";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const register = useCallback(
    async (email: string, password: string, name?: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, name }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Registrasi gagal");
        }

        const { token: newToken, user: userData } = data.data;

        setToken(newToken);
        setUser(userData);

        // Simpan ke localStorage
        localStorage.setItem("auth_token", newToken);
        localStorage.setItem("auth_user", JSON.stringify(userData));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Register error";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      setLoading(true);

      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setToken(null);
      setUser(null);
      setError(null);

      // Hapus dari localStorage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout error";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const refreshToken = useCallback(async () => {
    try {
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Refresh token gagal");
      }

      const newToken = data.data.token;
      setToken(newToken);
      localStorage.setItem("auth_token", newToken);
    } catch (err) {
      // Jika refresh gagal, logout
      await logout();
      throw err;
    }
  }, [token, logout]);

  const value: AuthContextType = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    refreshToken,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Component untuk protect route
 * Usage: <ProtectedRoute><YourComponent /></ProtectedRoute>
 */
export function ProtectedRoute({
  children,
  redirectTo = "/login",
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = require("next/router").useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, redirectTo, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}

/**
 * Axios interceptor untuk auto-add token
 * Gunakan di app initialization
 */
export function setupAuthInterceptor(axiosInstance: any) {
  axiosInstance.interceptors.request.use(
    (config: any) => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => Promise.reject(error)
  );

  // Handle 401 responses
  axiosInstance.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
}
