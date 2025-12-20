import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import type { UserInfo, UserContextType } from "../types";

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const { apiClient, clearAccessToken } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient("/api/user");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else if (response.status === 401 || response.status === 403) {
          setUser(null);
          clearAccessToken();
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      }
    };

    fetchUser();
  }, [apiClient, clearAccessToken]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
