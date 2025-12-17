import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";
import Dashboard from "./components/DashboardClean";
import { LinkPage } from "./components/LinkPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  const RequireAuth = ({ children }) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <div className="min-h-screen bg-white">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/links/:id" element={<LinkPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}