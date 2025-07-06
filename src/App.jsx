import "./css/App.css";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { MovieProvider } from "./contexts/MovieContext";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import NavBar from "./components/NavBar";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  const location = useLocation();
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  useEffect(() => {
    // Check if the current URL is /reset-password and if Supabase session type is "PASSWORD_RECOVERY"
    const hash = window.location.hash;
    const isResetRoute = location.pathname === "/reset-password";
    const session = supabase.auth.getSession ? null : null; // fallback if not using v2
    // For Supabase v2, use the async method:
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (
        isResetRoute &&
        session &&
        session.user &&
        session.user.email &&
        session.user.app_metadata &&
        session.user.app_metadata.provider &&
        session.user.app_metadata.provider === "email"
      ) {
        // Optionally, you can check for session type if available
        setIsPasswordReset(true);
      } else {
        setIsPasswordReset(false);
      }
    });
  }, [location.pathname]);

  return (
    <AuthProvider>
      <MovieProvider>
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/reset-password"
              element={
                isPasswordReset ? <ResetPassword /> : <Navigate to="/" />
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home key={location.pathname} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </MovieProvider>
    </AuthProvider>
  );
}

export default App;
