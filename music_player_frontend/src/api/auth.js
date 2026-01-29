import { apiRequest } from "./client";

// PUBLIC_INTERFACE
export async function registerUser({ email, password }) {
  /** Registers a new user. Expects backend endpoint POST /auth/register. */
  return await apiRequest("/auth/register", {
    method: "POST",
    body: { email, password },
  });
}

// PUBLIC_INTERFACE
export async function loginUser({ email, password }) {
  /** Logs in an existing user. Expects backend endpoint POST /auth/login. */
  return await apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}
