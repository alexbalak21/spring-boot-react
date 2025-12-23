import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useUser } from "../user";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const { apiClient, clearAccessToken } = useAuth();
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiClient("/api/auth/logout", { method: "POST" });
    } catch (err: any) {
      setError(err?.message || "Logout failed");
    } finally {
      clearAccessToken();
      setUser(null);
      setLoading(false);
      navigate("/");
    }
  };

  return { logout, loading, error } as const;
}
