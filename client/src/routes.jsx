import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Dashboard from "../pages/Dashboard/Dashboard";

/**
 * Protected Route Component
 * Wraps routes that require authentication
 */
export const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

/**
 * Public Route Component
 * Redirects to dashboard if already authenticated
 */
export const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" replace /> : children;
};

/**
 * Application Routes Configuration
 */
export const routes = [
  // Public Routes
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
    title: "Login",
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
    title: "Register",
  },

  // Protected Routes
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    title: "Dashboard",
  },

  // Catch all
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
    title: "Home",
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
    title: "Not Found",
  },
];

export default routes;
