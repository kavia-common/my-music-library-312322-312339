import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { LibraryPage } from "./pages/LibraryPage";
import { ToastProvider } from "./contexts/ToastContext";
import { PlayerProvider } from "./contexts/PlayerContext";

// PUBLIC_INTERFACE
function App() {
  /** Application entry: providers + routes (anonymous/public). */
  return (
    <ToastProvider>
      <PlayerProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PlayerProvider>
    </ToastProvider>
  );
}

export default App;
