// src/components/common/Header.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Header: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo y título */}
          <div className="header-brand">
            <Link to="/" className="brand-link">
              <div className="brand-icon">🃏</div>
              <h1 className="brand-title">PokéCollector</h1>
            </Link>
          </div>

          {/* Navegación */}
          <nav className="header-nav">
            {isAuthenticated ? (
              <>
                <Link to="/collection" className="nav-link">
                  Mi Colección
                </Link>
                <Link to="/ranking" className="nav-link">
                  Ranking
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="nav-link admin-link">
                    Administración
                  </Link>
                )}
                
                {/* Menú de usuario */}
                <div className="user-menu">
                  <div className="user-info">
                    <span className="user-name">👤 {user?.username}</span>
                    <span className="user-role">{user?.role}</span>
                  </div>
                  <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                    Cerrar Sesión
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/ranking" className="nav-link">
                  Ranking
                </Link>
                <Link to="/login" className="btn btn-primary btn-sm">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn btn-secondary btn-sm">
                  Registrarse
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

