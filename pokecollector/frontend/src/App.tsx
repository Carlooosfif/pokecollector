// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from '@/context/AuthContext';

// Layout components
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

// Pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import CollectionPage from '@/pages/CollectionPage';
import RankingPage from '@/pages/RankingPage';
import AdminPage from '@/pages/AdminPage';

// Styles
import '@/styles/index.css';
import '@/styles/components.css';
import '@/styles/layout.css';
import '@/styles/pages.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app-layout">
          <Header />
          
          <main className="main-content">
            <Routes>
              {/* Ruta pública de inicio */}
              <Route path="/" element={<HomePage />} />
              
              {/* Rutas de autenticación */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Ruta pública del ranking */}
              <Route path="/ranking" element={<RankingPage />} />
              
              {/* Rutas protegidas para usuarios autenticados */}
              <Route 
                path="/collection" 
                element={
                  <ProtectedRoute>
                    <CollectionPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Ruta protegida solo para administradores */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirección para rutas no encontradas */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;