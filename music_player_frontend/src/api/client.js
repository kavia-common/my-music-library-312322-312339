/**
 * Minimal fetch-based API client with consistent error handling.
 * Reads base URL from REACT_APP_API_BASE_URL for easy switching between environments.
 */

const DEFAULT_BASE_URL = "http://localhost:3001";

function getApiBaseUrl() {
  // CRA only exposes env vars prefixed with REACT_APP_
  return (process.env.REACT_APP_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");
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

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

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
