/**
 * API Service - Centralized API request handler
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  ok: boolean;
}

/**
 * Make an API request
 */
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { params, ...fetchOptions } = options;

  let url = `${API_BASE_URL}${endpoint}`;

  // Add query parameters
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  // Set default headers
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  };

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  const data = await response.json();

  return {
    data,
    status: response.status,
    ok: response.ok,
  };
}

/**
 * API methods
 */
export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};

export default api;
