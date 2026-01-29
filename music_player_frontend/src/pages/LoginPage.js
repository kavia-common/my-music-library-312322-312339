import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthForm } from "../components/AuthForm";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

// PUBLIC_INTERFACE
export function LoginPage() {
  /** Login screen with validation and error display. */
  const { login } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async ({ email, password }) => {
    setServerError("");
    setSubmitting(true);
    try {
      await login({ email, password });
      pushToast({ type: "success", title: "Welcome back", message: "Signed in successfully." });
      navigate("/library");
    } catch (err) {
      const msg = err?.message || "Login failed.";
      setServerError(msg);
      pushToast({ type: "error", title: "Login failed", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-center">
      <div className="card auth-card">
        <div className="card-header">
          <div>
            <h2>Sign in</h2>
            <p>Access your music library</p>
          </div>
        </div>
        <div className="card-body">
          <AuthForm mode="login" onSubmit={handleSubmit} submitting={submitting} serverError={serverError} />
          <div style={{ marginTop: 10 }}>
            <span className="muted">No account?</span>{" "}
            <Link to="/register">Create one</Link>
          </div>
          <p className="form-help" style={{ marginTop: 10 }}>
            Tip: set <code>REACT_APP_API_BASE_URL</code> to point at your backend (default: http://localhost:3001).
          </p>
        </div>
      </div>
    </div>
  );
}
