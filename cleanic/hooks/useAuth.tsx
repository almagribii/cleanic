"use client";

import { AxiosInstance, InternalAxiosRequestConfig } from "axios";

import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from "react";

import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

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

function getInitialAuthState() {
  if (typeof window === "undefined") {
    return { user: null, token: null };
  }

  const savedToken = localStorage.getItem("auth_token");
  const savedUser = localStorage.getItem("auth_user");

  if (!savedToken || !savedUser) {
    return { user: null, token: null };
  }

  try {
    return {
      token: savedToken,
      user: JSON.parse(savedUser) as User,
    };
  } catch {
    return { user: null, token: null };
  }
}

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
  const initialAuthState = getInitialAuthState();
  const [user, setUser] = useState<User | null>(initialAuthState.user);
  const [token, setToken] = useState<string | null>(initialAuthState.token);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
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
  }, []);

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
        const errorMessage =
          err instanceof Error ? err.message : "Register error";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
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
  const router = useRouter(); // Gunakan hook yang sudah di-import di atas

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
export function setupAuthInterceptor(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Pastikan kita di browser sebelum akses localStorage
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      // Hindari redirect berulang jika sudah di halaman login
      const isLoginPage =
        typeof window !== "undefined" && window.location.pathname === "/login";

      if (error.response?.status === 401 && !isLoginPage) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");

        // Gunakan window.location hanya jika benar-benar perlu hard redirect
        window.location.href = "/login";
      }
      return Promise.reject(error);
    },
  );
}
