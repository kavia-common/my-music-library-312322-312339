import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthForm } from "../components/AuthForm";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

// PUBLIC_INTERFACE
export function RegisterPage() {
  /** Registration screen with validation and error display. */
  const { register, isAuthenticated } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async ({ email, password }) => {
    setServerError("");
    setSubmitting(true);
    try {
      const res = await register({ email, password });
      pushToast({ type: "success", title: "Account created", message: "You can now use your library." });

      // If backend didn't return token, redirect to login; otherwise to library.
      if (isAuthenticated || res?.token) {
        navigate("/library");
      } else {
        navigate("/login");
      }
    } catch (err) {
      const msg = err?.message || "Registration failed.";
      setServerError(msg);
      pushToast({ type: "error", title: "Registration failed", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-center">
      <div className="card auth-card">
        <div className="card-header">
          <div>
            <h2>Create account</h2>
            <p>Start building your personal library</p>
          </div>
        </div>
        <div className="card-body">
          <AuthForm mode="register" onSubmit={handleSubmit} submitting={submitting} serverError={serverError} />
          <div style={{ marginTop: 10 }}>
            <span className="muted">Already have an account?</span>{" "}
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
