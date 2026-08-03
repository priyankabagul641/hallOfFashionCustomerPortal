export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/v1";

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  message: string;
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]> | string[];

  constructor(message: string, status: number, errors?: Record<string, string[]> | string[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

const TOKEN_KEY = "hof_customer_token";
const REFRESH_KEY = "hof_customer_refresh";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(REFRESH_KEY);
}

export function storeSession(accessToken: string, refreshToken: string) {
  sessionStorage.setItem(TOKEN_KEY, accessToken);
  sessionStorage.setItem(REFRESH_KEY, refreshToken);
}

export function hasSession(): boolean {
  return getToken() !== null;
}

export function clearSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
}

// Shared in-flight promise so concurrent 401s all await the same refresh call
// instead of racing (backend rotates the refresh token on every call).
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return null;

      const body = await res.json();
      const { accessToken, refreshToken: newRefreshToken } = body.data ?? {};
      if (!accessToken || !newRefreshToken) return null;

      storeSession(accessToken, newRefreshToken);
      return accessToken as string;
    } catch {
      return null;
    }
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

async function fetchWithAuth(url: string, init: RequestInit, retried = false): Promise<Response> {
  const token = getToken();
  const headers: Record<string, string> = { ...(init.headers as Record<string, string> ?? {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { ...init, headers });

  if (res.status === 401 && !retried) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return fetchWithAuth(url, init, true);
    }
  }

  return res;
}

async function request<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string> ?? {}),
  };

  const url = `${BASE_URL}${path}`;
  const hadToken = getToken() !== null;
  const res = await fetchWithAuth(url, { ...options, headers });

  // Only treat a 401 as "session expired" when the request actually carried a
  // session token (i.e. an authenticated call whose token was rejected/expired).
  // A 401 from an unauthenticated call (e.g. login with wrong credentials) is a
  // normal request failure and must surface the backend's real error message.
  if (res.status === 401 && hadToken) {
    clearSession();
    throw new ApiError("Session expired. Please log in again.", 401);
  }

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    let errors: Record<string, string[]> | undefined;
    try {
      const body = await res.json();
      errors = body.errors;
      const errorMessages = Array.isArray(body.errors)
        ? body.errors
        : errors
        ? Object.values(errors).flat()
        : undefined;
      message = errorMessages?.length ? errorMessages.join(", ") : body.message ?? message;
    } catch {
      // ignore parse error
    }
    throw new ApiError(message, res.status, errors);
  }

  return res.json() as Promise<ApiResponse<T>>;
}

function withQuery(path: string, params?: Record<string, string | number | boolean>): string {
  if (!params) return path;
  const qs = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  ).toString();
  return qs ? `${path}?${qs}` : path;
}

export function apiGet<T>(path: string, params?: Record<string, string | number | boolean>) {
  return request<T>(withQuery(path, params));
}

export function apiPost<T>(path: string, body?: unknown) {
  return request<T>(path, { method: "POST", body: body !== undefined ? JSON.stringify(body) : undefined });
}

export function apiPut<T>(path: string, body?: unknown) {
  return request<T>(path, { method: "PUT", body: body !== undefined ? JSON.stringify(body) : undefined });
}

export function apiPatch<T>(path: string, body?: unknown) {
  return request<T>(path, { method: "PATCH", body: body !== undefined ? JSON.stringify(body) : undefined });
}

export function apiDelete<T>(path: string) {
  return request<T>(path, { method: "DELETE" });
}

// Multipart upload (e.g. POST /storage/upload) — no Content-Type set so the
// browser fills in the multipart boundary itself.
export async function apiUpload<T>(
  path: string,
  file: File,
  params?: Record<string, string>
): Promise<ApiResponse<T>> {
  const formData = new FormData();
  formData.append("file", file);

  const url = withQuery(`${BASE_URL}${path}`, params);
  const res = await fetchWithAuth(url, { method: "POST", body: formData });

  if (res.status === 401) {
    clearSession();
    throw new ApiError("Session expired. Please log in again.", 401);
  }

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      message = body.message ?? message;
    } catch {
      // ignore parse error
    }
    throw new ApiError(message, res.status);
  }

  return res.json() as Promise<ApiResponse<T>>;
}
