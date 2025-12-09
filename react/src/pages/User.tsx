import { useEffect, useState, useMemo } from "react";
import styles from "./Login.module.css"; 
import { useCsrf } from "../hooks/useCsrf"; 
import { useAuthorizedApi } from "../hooks/useAuthorizedApi";

const USER_URL = "/user"; // baseURL is already set in useAuthorizedApi

interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function User() {
  const csrfReady = useCsrf();

  // ✅ Memoize the API client so it doesn't change every render
  const api = useMemo(() => useAuthorizedApi(), []);

  const [user, setUser] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!csrfReady) {
      console.log("[User] CSRF not ready yet, skipping fetchUser");
      return;
    }

    const fetchUser = async () => {
      console.log("[User] Starting API call to /api/user...");
      try {
        const response = await api.get(USER_URL, {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
          withCredentials: true,
        });
        console.log("[User] API call succeeded:", response.data);
        setUser(response.data);
      } catch (err: any) {
        console.error("[User] API call failed:", err.response?.data || err.message);
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to load user info"
        );
      } finally {
        console.log("[User] API call finished");
        setLoading(false);
      }
    };

    fetchUser();
  }, [csrfReady, api]); // ✅ runs only once when csrfReady flips true

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>User Profile</h2>

        {loading && <p>Loading user info...</p>}
        {error && <div className={styles.error}>{error}</div>}
        {user && (
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <strong>ID:</strong> {user.id}
            </div>
            <div className={styles.formGroup}>
              <strong>Name:</strong> {user.name}
            </div>
            <div className={styles.formGroup}>
              <strong>Email:</strong> {user.email}
            </div>
            <div className={styles.formGroup}>
              <strong>Role:</strong> {user.role}
            </div>
            <div className={styles.formGroup}>
              <strong>Created At:</strong>{" "}
              {new Date(user.createdAt).toLocaleString()}
            </div>
            <div className={styles.formGroup}>
              <strong>Updated At:</strong>{" "}
              {new Date(user.updatedAt).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
