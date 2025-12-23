import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef
} from "react";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  clearAccessToken: () => void;
  authenticated: boolean;
  refreshAccessToken: () => Promise<string | null>;
  apiClient: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(() => {
    try {
      return localStorage.getItem("access_token");
    } catch {
      return null;
    }
  });

  const isRefreshing = useRef(false);
  const refreshSubscribers = useRef<Array<(token: string | null) => void>>([]);

  // Sync token across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "access_token") {
        setAccessTokenState(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setAccessToken = (token: string | null) => {
    try {
      if (token) localStorage.setItem("access_token", token);
      else localStorage.removeItem("access_token");
    } catch {}
    setAccessTokenState(token);
  };

  const clearAccessToken = useCallback(() => {
    localStorage.removeItem("access_token");
    setAccessTokenState(null);
  }, []);

  // -----------------------------
  // REFRESH TOKEN
  // -----------------------------
  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    if (isRefreshing.current) {
      return new Promise(resolve => {
        refreshSubscribers.current.push(resolve);
      });
    }

    isRefreshing.current = true;

    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json", "Content-Type": "application/json" }
      });

      if (!response.ok) {
        refreshSubscribers.current.forEach(cb => cb(null));
        refreshSubscribers.current = [];
        clearAccessToken();
        return null;
      }

      const data = await response.json();
      const newToken = data.access_token;

      setAccessToken(newToken);

      refreshSubscribers.current.forEach(cb => cb(newToken));
      refreshSubscribers.current = [];

      return newToken;
    } catch {
      refreshSubscribers.current.forEach(cb => cb(null));
      refreshSubscribers.current = [];
      clearAccessToken();
      return null;
    } finally {
      isRefreshing.current = false;
    }
  }, [clearAccessToken]);

  // -----------------------------
  // API CLIENT
  // -----------------------------
  const apiClient = useCallback(
    async (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
      const url = input.toString();
      const isPublic = ["/api/auth/refresh", "/api/csrf"].some(p => url.includes(p));

      const makeRequest = async (token: string | null) => {
        const headers = new Headers(init.headers);
        if (token && !isPublic) headers.set("Authorization", `Bearer ${token}`);

        return fetch(url, {
          ...init,
          headers,
          credentials: "include"
        });
      };

      // First attempt
      let response = await makeRequest(accessToken);

      const expired = response.headers.get("X-Token-Expired") === "true";
      if (!expired) return response;

      // Refresh
      const newToken = await refreshAccessToken();
      if (!newToken) return response;

      // Retry once
      return makeRequest(newToken);
    },
    [accessToken, refreshAccessToken]
  );

  const value = useMemo(
    () => ({
      accessToken,
      setAccessToken,
      clearAccessToken,
      authenticated: !!accessToken,
      refreshAccessToken,
      apiClient
    }),
    [accessToken, refreshAccessToken, apiClient, clearAccessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
