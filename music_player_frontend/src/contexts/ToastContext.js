import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

function makeId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

// PUBLIC_INTERFACE
export function ToastProvider({ children }) {
  /** Provides toast notifications (success/error/info) across the app. */
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback((toast) => {
    const id = makeId();
    const ttlMs = toast.ttlMs ?? 4500;

    const next = { id, type: toast.type || "info", title: toast.title || "Notice", message: toast.message || "" };
    setToasts((prev) => [next, ...prev]);

    window.setTimeout(() => removeToast(id), ttlMs);
    return id;
  }, [removeToast]);

  const api = useMemo(
    () => ({
      toasts,
      pushToast,
      removeToast,
    }),
    [toasts, pushToast, removeToast]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-wrap" aria-live="polite" aria-relevant="additions">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              "toast",
              t.type === "success" ? "toast-success" : "",
              t.type === "error" ? "toast-error" : "",
            ].join(" ")}
            role="status"
          >
            <p className="toast-title">{t.title}</p>
            {t.message ? <p className="toast-message">{t.message}</p> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useToast() {
  /** Hook to push toast notifications. */
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
