import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthContextType, LoginRequest, RegisterRequest } from '@/types/auth';
import { User } from '@/types/user';
import { authService } from '@/services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = authService.getStoredToken();
        const storedUser = authService.getStoredUser();

        if (storedToken && storedUser) {
          const validation = await authService.validateToken();

          if (validation) {
            setToken(storedToken);
            setUser(storedUser);
          } else {
            authService.logout();
          }
        }
      } catch (error) {
        console.error('Error inicializando autenticación:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setLoading(true);
      const authResponse = await authService.login(credentials);

      setUser(authResponse.user);
      setToken(authResponse.token);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      setLoading(true);
      const authResponse = await authService.register(userData);

      setUser(authResponse.user);
      setToken(authResponse.token);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'ADMIN';

  const contextValue: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'ADMIN' | 'COMMON';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }

  if (requiredRole === 'ADMIN' && !isAdmin) {
    return (
      <div className="access-denied">
        <h2>Acceso Denegado</h2>
        <p>No tienes permisos para acceder a esta página.</p>
        <p>Se requiere rol de administrador.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export const usePermissions = () => {
  const { isAdmin, isAuthenticated } = useAuth();

  const canViewAdminPanel = isAdmin;
  const canCreateAlbums = isAdmin;
  const canCreateCards = isAdmin;
  const canManageUsers = isAdmin;
  const canViewOwnCollection = isAuthenticated;
  const canAddCardsToCollection = isAuthenticated;

  return {
    canViewAdminPanel,
    canCreateAlbums,
    canCreateCards,
    canManageUsers,
    canViewOwnCollection,
    canAddCardsToCollection,
  };
};
