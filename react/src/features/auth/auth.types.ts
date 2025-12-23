export type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  clearAccessToken: () => void;
  authenticated: boolean;
  refreshAccessToken: () => Promise<string | null>;
  apiClient: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};