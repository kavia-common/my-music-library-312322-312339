import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LibraryPage } from "./pages/LibraryPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { PlayerProvider } from "./contexts/PlayerContext";

// PUBLIC_INTERFACE
function App() {
  /** Application entry: providers + routes. */
  return (
    <AuthProvider>
      <ToastProvider>
        <PlayerProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/library" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/library" element={<LibraryPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/library" replace />} />
            </Routes>
          </BrowserRouter>
        </PlayerProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
