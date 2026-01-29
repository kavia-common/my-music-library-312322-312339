/**
 * Minimal fetch-based API client with consistent error handling.
 *
 * Env var resolution (first match wins):
 * - REACT_APP_API_BASE_URL (preferred)
 * - REACT_APP_API_BASE
 * - REACT_APP_BACKEND_URL
 *
 * If none are set, we default to "same host :3001" (useful for preview) and
 * fall back to localhost:3001 when window is not available (tests/SSR).
 */

function defaultBaseUrl() {
  // Prefer "same host :3001" to work in preview environments automatically.
  if (typeof window !== "undefined" && window.location?.hostname) {
    const protocol = window.location.protocol || "http:";
    return `${protocol}//${window.location.hostname}:3001`;
  }
  return "http://localhost:3001";
}

function getApiBaseUrl() {
  // CRA only exposes env vars prefixed with REACT_APP_
  const envBase =
    process.env.REACT_APP_API_BASE_URL ||
    process.env.REACT_APP_API_BASE ||
    process.env.REACT_APP_BACKEND_URL ||
    "";

  const base = (envBase || defaultBaseUrl()).trim();

  // Normalize: remove trailing slashes
  return base.replace(/\/*$/, "");
}

async function safeReadJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function buildErrorMessage({ response, json }) {
  const base = `Request failed (${response.status} ${response.statusText})`;
  if (json && typeof json === "object") {
    // Common FastAPI / generic error shapes
    const detail = json.detail || json.message || json.error;
    if (typeof detail === "string" && detail.trim()) return `${base}: ${detail}`;
    if (Array.isArray(detail) && detail.length) return `${base}: ${JSON.stringify(detail)}`;
  }
  return base;
}

// PUBLIC_INTERFACE
export async function apiRequest(path, { method = "GET", headers, body } = {}) {
  /** Performs an HTTP request to the backend API and throws an Error on non-2xx responses. */
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

  const finalHeaders = {
    ...(headers || {}),
  };

  // Only set JSON content-type if body is not FormData.
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (body && !isFormData && !finalHeaders["Content-Type"]) {
    finalHeaders["Content-Type"] = "application/json";
  }

  // Auth removed: do not send Authorization headers.

  let response;
  try {
    response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  } catch (e) {
    // Typical browser error text is "Failed to fetch" which hides the real cause.
    // Provide actionable diagnostics (URL + env var hint).
    const envBase =
      process.env.REACT_APP_API_BASE_URL ||
      process.env.REACT_APP_API_BASE ||
      process.env.REACT_APP_BACKEND_URL;

    const hint = envBase
      ? `Using env base URL: ${envBase}`
      : `No API base env set (REACT_APP_API_BASE_URL / REACT_APP_API_BASE / REACT_APP_BACKEND_URL). Falling back to ${getApiBaseUrl()}`;

    throw new Error(`Network error calling backend (${url}). ${hint}. Original error: ${e?.message || String(e)}`);
  }

  if (!response.ok) {
    const json = await safeReadJson(response);
    const err = new Error(buildErrorMessage({ response, json }));
    err.status = response.status;
    err.data = json;
    throw err;
  }

  // For empty responses
  if (response.status === 204) return null;

  // If response is audio/stream, caller should handle as URL (we provide separate helper).
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await response.json();
  }
  return await response.text();
}

// PUBLIC_INTERFACE
export function getStreamUrl(songId) {
  /** Returns the absolute streaming URL for a song. */
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}/songs/${encodeURIComponent(songId)}/stream`;
}
