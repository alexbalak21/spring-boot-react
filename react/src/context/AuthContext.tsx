import React, { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from "react";

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

  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshPromise = useRef<Promise<string | null> | null>(null);

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
      if (token) {
        localStorage.setItem("access_token", token);
      } else {
        localStorage.removeItem("access_token");
      }
    } catch { }
    setAccessTokenState(token);
  };

  const clearAccessToken = useCallback(() => {
    // Clear the access token from memory and localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem("access_token");
    }
    setAccessTokenState(null);
  }, []);

  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    if (isRefreshing && refreshPromise.current) {
      return refreshPromise.current;
    }

    const doRefresh = async (): Promise<string | null> => {
      try {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include', // This ensures cookies are sent with the request
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to refresh token');
        }

        const data = await response.json();
        const newAccessToken = data.access_token || data.accessToken;

        if (!newAccessToken) {
          throw new Error('No access token in response');
        }

        setAccessToken(newAccessToken);
        return newAccessToken;
      } catch (error) {
        console.error('Error refreshing token:', error);
        clearAccessToken();
        return null;
      } finally {
        setIsRefreshing(false);
        refreshPromise.current = null;
      }
    };

    setIsRefreshing(true);
    const promise = doRefresh();
    refreshPromise.current = promise;
    return promise;
  }, [isRefreshing, clearAccessToken]);

  // Create an API client that automatically handles token refresh
  const apiClient = useCallback(
    async (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
      // Convert URL object to string if needed
      const url = input instanceof URL ? input.toString() : input;

      // Create headers object if it doesn't exist
      const headers = new Headers(init.headers);
      if (accessToken && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }

      // Make the initial request
      let response = await fetch(url, {
        ...init,
        headers,
      });

      // Handle token expiration
      if (response.status === 401 && response.headers.get('X-Token-Expired') === 'true') {
        console.log("access_token expired");
        const newToken = await refreshAccessToken();

        if (newToken) {
          // Update the authorization header with the new token
          headers.set('Authorization', `Bearer ${newToken}`);

          // Retry the original request with the new token
          response = await fetch(url, {
            ...init,
            headers,
          });
        } else {
          clearAccessToken();
        }
      }

      return response;
    },
    [accessToken, refreshAccessToken, clearAccessToken]
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
