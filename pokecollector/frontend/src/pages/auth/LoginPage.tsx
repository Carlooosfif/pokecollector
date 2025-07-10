// src/pages/auth/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error al cambiar los datos
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(formData);
      navigate('/collection');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      setFormData({
        email: 'admin@pokecollector.com',
        password: 'admin123'
      });
    } else {
      setFormData({
        email: 'ash@pokecollector.com',
        password: 'user123'
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="container-sm">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">🃏</div>
            <h1>Iniciar Sesión</h1>
            <p>Accede a tu colección de cartas Pokémon</p>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="tu@email.com"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Tu contraseña"
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="sm" message="" /> : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Credenciales de demo */}
          <div className="demo-credentials">
            <h3>Credenciales de Prueba</h3>
            <div className="demo-buttons">
              <button
                type="button"
                onClick={() => fillDemoCredentials('user')}
                className="btn btn-secondary btn-sm"
                disabled={loading}
              >
                Usuario Común
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="btn btn-warning btn-sm"
                disabled={loading}
              >
                Administrador
              </button>
            </div>
          </div>

          <div className="auth-footer">
            <p>
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="auth-link">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
