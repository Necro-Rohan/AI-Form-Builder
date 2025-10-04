import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import FormBuilderPage from "./pages/FormBuilderPage";
import ResponsesPage from "./pages/ResponsesPage";
import PublicFormPage from "./pages/PublicFormPage";
import TestFormPage from "./pages/TestFormPage";
import Navigation from "./components/Navigation";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="bg-slate-50 min-h-screen font-sans">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />

              <Route path="/forms/new" element={
                <ProtectedRoute>
                  <FormBuilderPage />
                </ProtectedRoute>
              } />

              <Route path="/forms/:id" element={
                <ProtectedRoute>
                  <FormBuilderPage />
                </ProtectedRoute>
              } />

              <Route path="/forms/:id/responses" element={
                <ProtectedRoute>
                  <ResponsesPage />
                </ProtectedRoute>
              } />

              <Route path="/responses" element={
                <ProtectedRoute>
                  <ResponsesPage />
                </ProtectedRoute>
              } />

              <Route path="/f/:id" element={<PublicFormPage />} />
              <Route path="/test-form" element={<TestFormPage />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;