import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export function Header() {
  /** App header with branding (anonymous/public). */
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
          <span className="badge" title="Anonymous">
            Anonymous
          </span>
          <Link className="btn btn-small" to="/library">
            Library
          </Link>
        </div>
      </div>
    </header>
  );
}
