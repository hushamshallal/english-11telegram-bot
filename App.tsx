
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import SelectStagePage from './pages/SelectStagePage.tsx';
import SelectBookPage from './pages/SelectBookPage.tsx';
import ChatPage from './pages/ChatPage.tsx';
import AdminDashboardPage from './pages/AdminDashboardPage.tsx';
import SubscriptionRequiredPage from './pages/SubscriptionRequiredPage.tsx';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-100"></div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-gray-100"></div>;
    }
    
    if (!user || !user.isAdmin) {
        return <Navigate to="/select-stage" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};


interface SubscriptionRouteProps {
    children: React.ReactNode;
}
const SubscriptionRoute: React.FC<SubscriptionRouteProps> = ({ children }) => {
    const { user } = useAuth();

    // Admin users have implicit subscription
    if (!user?.isSubscribed && !user?.isAdmin) {
        return <Navigate to="/subscription-required" replace />;
    }

    return <>{children}</>;
};


const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
      return <div></div>; 
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/subscription-required" element={<SubscriptionRequiredPage />} />

      <Route path="/" element={<ProtectedRoute><Navigate to="/select-stage" /></ProtectedRoute>} />
      
      <Route path="/select-stage" element={<ProtectedRoute><SelectStagePage /></ProtectedRoute>} />
      <Route path="/select-book/:stage" element={<ProtectedRoute><SelectBookPage /></ProtectedRoute>} />
      <Route path="/chat/:bookId" element={<ProtectedRoute><SubscriptionRoute><ChatPage /></SubscriptionRoute></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;