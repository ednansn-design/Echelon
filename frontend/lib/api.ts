import {
  DEMO_USER,
  DEMO_STATS,
  DEMO_SCHOLARSHIPS,
  DEMO_APPLICATIONS,
} from "./demo-data";

export const API_URL = "http://localhost:8000/api";

/**
 * Detect demo mode: running on GitHub Pages or any non-localhost host
 * where the backend API isn't available.
 */
export function isDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host !== "localhost" && host !== "127.0.0.1";
}

/**
 * Create a fake Response object from JSON data.
 */
function mockResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Route demo-mode API calls to hardcoded data.
 * Matches the same endpoints the real backend serves.
 */
function handleDemoRequest(endpoint: string, options: RequestInit = {}): Response {
  const method = (options.method || "GET").toUpperCase();

  // GET /users/me
  if (endpoint === "/users/me" && method === "GET") {
    return mockResponse(DEMO_USER);
  }

  // PUT /users/me  (profile update — just echo back)
  if (endpoint === "/users/me" && method === "PUT") {
    return mockResponse({ ...DEMO_USER, ...JSON.parse((options.body as string) || "{}") });
  }

  // GET /users/me/stats
  if (endpoint === "/users/me/stats") {
    return mockResponse(DEMO_STATS);
  }

  // GET /swipe/feed
  if (endpoint === "/swipe/feed") {
    return mockResponse(DEMO_SCHOLARSHIPS);
  }

  // POST /swipe (save/skip — just acknowledge)
  if (endpoint === "/swipe" && method === "POST") {
    return mockResponse({ status: "ok" });
  }

  // GET /applications
  if (endpoint === "/applications" && method === "GET") {
    return mockResponse(DEMO_APPLICATIONS);
  }

  // PATCH /applications/:id (status update — just acknowledge)
  if (endpoint.startsWith("/applications/") && method === "PATCH") {
    return mockResponse({ status: "ok" });
  }

  // Fallback
  return mockResponse({ detail: "Demo mode — endpoint not mocked" }, 200);
}

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // ── Demo mode: no real API, return mock data ──
  if (isDemoMode()) {
    return handleDemoRequest(endpoint, options);
  }

  // ── Real mode: hit the backend ──
  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      const base = isDemoMode() ? "/Echelon" : "";
      window.location.href = `${base}/login`;
    }
  }

  return response;
}
