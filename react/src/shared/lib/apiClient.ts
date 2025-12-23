// shared/lib/apiClient.ts
export const apiClient = {
  get: (url: string) =>
    fetch(url, { credentials: "include" }),

  post: (url: string, body: unknown) =>
    fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }),

  put: (url: string, body: unknown) =>
    fetch(url, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }),

  delete: (url: string) =>
    fetch(url, {
      method: "DELETE",
      credentials: "include",
    }),
};