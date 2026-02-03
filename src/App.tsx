
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { PlansPage } from './pages/PlansPage';
import { SiteForm } from './pages/SiteForm';
import { AdminPanel } from './pages/AdminPanel';
import { PublicSite } from './pages/PublicSite';

const PrivateRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[10px] uppercase font-black tracking-widest text-zinc-400">Carregando Sessão...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return (
    <AppLayout user={user} onLogout={signOut}>
      {children}
    </AppLayout>
  );
};

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[10px] uppercase font-black tracking-widest text-zinc-400">Inicializando...</div>;

  return (
    <Routes>
      <Route path="/site/:slug" element={<PublicSite />} />
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />

      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/planos" element={<PrivateRoute><PlansPage /></PrivateRoute>} />
      <Route path="/create" element={<PrivateRoute><SiteForm /></PrivateRoute>} />
      <Route path="/edit/:id" element={<PrivateRoute><SiteForm /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute adminOnly><AdminPanel /></PrivateRoute>} />

      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
