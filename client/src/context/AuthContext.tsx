import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { type AuthUser } from "@/lib/cv";
import { fetchCurrentUser, loginAdmin, type LoginPayload } from "@/services/portfolioApi";

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const TOKEN_STORAGE_KEY = "portfolio_admin_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    typeof window === "undefined" ? null : localStorage.getItem(TOKEN_STORAGE_KEY),
  );
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    let mounted = true;
    setIsLoading(true);

    fetchCurrentUser(token)
      .then((sessionUser) => {
        if (!mounted) return;
        setUser(sessionUser);
      })
      .catch(() => {
        if (!mounted) return;
        setToken(null);
        setUser(null);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isLoading,
      login: async (payload) => {
        const response = await loginAdmin(payload);
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
      },
      logout: () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      },
    }),
    [isLoading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
}
