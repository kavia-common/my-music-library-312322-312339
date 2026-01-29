import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// PUBLIC_INTERFACE
export function ProtectedRoute() {
  /** Guards nested routes, redirecting to /login if unauthenticated. */
  const { isAuthenticated, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="page-center">
        <div className="card auth-card">
          <div className="card-body">
            <p className="muted">Loading session…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}
