import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = "XSRF-TOKEN";
axios.defaults.xsrfHeaderName = "X-XSRF-TOKEN";

export function useCsrf() {
  const [csrfReady, setCsrfReady] = useState(false);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      console.log("[useCsrf] Fetching CSRF token...");
      try {
        await axios.get("/api/csrf");
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
