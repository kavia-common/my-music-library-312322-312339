import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

// PUBLIC_INTERFACE
export function Header() {
  /** App header with branding and auth actions. */
  const { user, logout } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const doLogout = () => {
    logout();
    pushToast({ type: "success", title: "Signed out", message: "You have been logged out." });
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <div className="brand">
          <div className="brand-badge" aria-hidden="true" />
          <div className="brand-title">
            <strong>My Music Library</strong>
            <span>Upload • Browse • Play</span>
          </div>
        </div>

        <div className="header-actions">
          <span className="badge" title={user?.email || ""}>
            {user?.email ? user.email : "Signed in"}
          </span>
          <Link className="btn btn-small" to="/library">
            Library
          </Link>
          <button className="btn btn-small btn-danger" type="button" onClick={doLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
