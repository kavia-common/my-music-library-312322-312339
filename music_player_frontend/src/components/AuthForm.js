import React, { useMemo, useState } from "react";

// PUBLIC_INTERFACE
export function AuthForm({ mode, onSubmit, submitting, serverError }) {
  /** Reusable auth form (login/register) with simple client-side validation. */
  const isRegister = mode === "register";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const { emailError, passwordError, confirmError, canSubmit } = useMemo(() => {
    const e = email.trim();
    const emailError = !e ? "Email is required." : !/^\S+@\S+\.\S+$/.test(e) ? "Enter a valid email address." : "";
    const passwordError = password.length < 6 ? "Password must be at least 6 characters." : "";
    const confirmError = isRegister && confirm !== password ? "Passwords do not match." : "";
    const canSubmit = !emailError && !passwordError && !confirmError;
    return { emailError, passwordError, confirmError, canSubmit };
  }, [email, password, confirm, isRegister]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    onSubmit({ email: email.trim(), password });
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className="input"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        {emailError ? <p className="error">{emailError}</p> : null}
      </div>

      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          className="input"
          type="password"
          autoComplete={isRegister ? "new-password" : "current-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        {passwordError ? <p className="error">{passwordError}</p> : null}
      </div>

      {isRegister ? (
        <div>
          <label className="label" htmlFor="confirm">
            Confirm password
          </label>
          <input
            id="confirm"
            className="input"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
          />
          {confirmError ? <p className="error">{confirmError}</p> : null}
        </div>
      ) : null}

      {serverError ? <p className="error">{serverError}</p> : null}

      <button className="btn btn-primary" type="submit" disabled={!canSubmit || submitting}>
        {submitting ? "Please wait…" : isRegister ? "Create account" : "Sign in"}
      </button>

      <p className="form-help">
        {isRegister
          ? "Create an account to start uploading and playing your music."
          : "Sign in to access your personal music library."}
      </p>
    </form>
  );
}
