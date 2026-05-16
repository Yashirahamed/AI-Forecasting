import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Pages (Placeholders)
const Home = () => <div className="p-8">Home Page</div>;
const Dashboard = () => <div className="p-8">Dashboard Page</div>;
const Login = () => <div className="p-8">Login Page</div>;
const Register = () => <div className="p-8">Register Page</div>;
const Admin = () => <div className="p-8">Admin Dashboard</div>;

// Layout
import Navbar from './components/layout/Navbar';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

// Admin Route Component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  // Note: Admin check would usually involve custom claims from ID token
  const isAdmin = (user as any)?.reloadUserInfo?.customAttributes?.includes('admin');
  return user && isAdmin ? <>{children}</> : <Navigate to="/dashboard" />;
};

const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          {/* Add more routes here */}
        </Routes>
      </AnimatePresence>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppRoutes />
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
