import { useEffect, useState } from "react";
import { apiClient } from "../lib";

export function useCsrf() {
  const [csrfReady, setCsrfReady] = useState(false);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      console.log("[useCsrf] Fetching CSRF token...");
      try {
        await apiClient.get("/api/csrf");
        console.log("[useCsrf] CSRF token fetched. Cookie:", document.cookie);
        setCsrfReady(true);
      } catch (err) {
        console.error("[useCsrf] Failed to fetch CSRF token", err);
      }
    };
    fetchCsrfToken();
  }, []);

  return csrfReady;
}
