import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loginUser, registerUser } from "../api/auth";

const AuthContext = createContext(null);

const STORAGE_KEY = "music_player_auth_v1";

function normalizeAuthResponse(data) {
  // Be defensive: backend contract may change.
  // Common possibilities:
  // - { access_token, token_type }
  // - { token }
  // - { session: { access_token } }
  const token =
    data?.access_token ||
    data?.token ||
    data?.session?.access_token ||
    data?.session_token ||
    null;

  const user =
    data?.user ||
    (data?.email ? { email: data.email } : null);

  return { token, user, raw: data };
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides authentication state and actions. Persists token in localStorage for reloads. */
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Load persisted session
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.token) setToken(parsed.token);
        if (parsed?.user) setUser(parsed.user);
      }
    } catch {
      // ignore corrupted storage
    } finally {
      setInitializing(false);
    }
  }, []);

  useEffect(() => {
    // Persist session
    try {
      if (token) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, [token, user]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const data = await loginUser({ email, password });
    const normalized = normalizeAuthResponse(data);
    if (!normalized.token) {
      const err = new Error("Login succeeded but no token was returned by the server.");
      err.data = data;
      throw err;
    }
    setToken(normalized.token);
    setUser(normalized.user || { email });
    return normalized;
  }, []);

  const register = useCallback(async ({ email, password }) => {
    const data = await registerUser({ email, password });
    // Some APIs auto-login on register; some don't. If token exists, store it.
    const normalized = normalizeAuthResponse(data);
    if (normalized.token) {
      setToken(normalized.token);
      setUser(normalized.user || { email });
    }
    return normalized;
  }, []);

  const api = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      initializing,
      login,
      register,
      logout,
    }),
    [token, user, initializing, login, register, logout]
  );

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth state/actions. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
