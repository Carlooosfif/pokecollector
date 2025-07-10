// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { albumService } from '@/services/albumService';
import { userService } from '@/services/userService';
import { Album } from '@/types/album';
import { RankingEntry } from '@/types/user';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [topUsers, setTopUsers] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      
      const [albumsData, rankingData] = await Promise.all([
        albumService.getAllAlbums(),
        userService.getRanking()
      ]);

      setAlbums(albumsData);
      setTopUsers(rankingData.slice(0, 3)); // Top 3 usuarios
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: '🃏',
      title: 'Colecciona Cartas',
      description: 'Gestiona tu colección personal de cartas Pokémon de las primeras dos generaciones.'
    },
    {
      icon: '🏆',
      title: 'Compite en Rankings',
      description: 'Compara tu progreso con otros coleccionistas y escala posiciones en el ranking.'
    },
    {
      icon: '📊',
      title: 'Estadísticas Detalladas',
      description: 'Visualiza tu progreso con estadísticas completas de tu colección.'
    },
    {
      icon: '⚙️',
      title: 'Panel de Admin',
      description: 'Los administradores pueden crear nuevos álbumes y gestionar el sistema.'
    }
  ];

  if (loading) {
    return <LoadingSpinner message="Cargando..." />;
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                🃏 <span className="gradient-text">PokéCollector</span>
              </h1>
              <p className="hero-subtitle">
                El sistema definitivo para coleccionar y gestionar tus cartas Pokémon de 1ra y 2da generación
              </p>
              
              {isAuthenticated ? (
                <div className="hero-authenticated">
                  <p className="welcome-message">
                    ¡Bienvenido de vuelta, <strong>{user?.username}</strong>! 👋
                  </p>
                  <div className="hero-actions">
                    <Link to="/collection" className="btn btn-primary btn-lg">
                      📦 Ver Mi Colección
                    </Link>
                    <Link to="/ranking" className="btn btn-secondary btn-lg">
                      🏆 Ver Ranking
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="hero-actions">
                  <Link to="/register" className="btn btn-primary btn-lg">
                    🚀 Comenzar Ahora
                  </Link>
                  <Link to="/login" className="btn btn-secondary btn-lg">
                    👤 Iniciar Sesión
                  </Link>
                </div>
              )}
            </div>
            
            <div className="hero-image">
              <div className="floating-cards">
                <div className="card-float card-1">🃏</div>
                <div className="card-float card-2">⭐</div>
                <div className="card-float card-3">💎</div>
                <div className="card-float card-4">🔥</div>
                <div className="card-float card-5">⚡</div>
                <div className="card-float card-6">🌿</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">✨ Características Principales</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <Card key={index} className="feature-card" hover>
                <div className="card-body">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Albums Section */}
      <section className="albums-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">📚 Álbumes Disponibles</h2>
            <p className="section-subtitle">
              Explora las colecciones de cartas Pokémon disponibles en el sistema
            </p>
          </div>
          
          {albums.length > 0 ? (
            <div className="albums-grid">
              {albums.map(album => (
                <Card key={album.id} className="album-preview" hover>
                  <div className="card-body">
                    {album.imageUrl && (
                      <div className="album-image">
                        <img src={album.imageUrl} alt={album.name} />
                      </div>
                    )}
                    <div className="album-info">
                      <h3 className="album-name">{album.name}</h3>
                      <p className="album-description">{album.description}</p>
                      <div className="album-meta">
                        <Badge variant="info">Generación {album.generation}</Badge>
                        <Badge variant="secondary">{album.totalCards} cartas</Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="empty-albums">
              <div className="empty-icon">📚</div>
              <h3>No hay álbumes disponibles</h3>
              <p>Los administradores aún no han creado álbumes de cartas.</p>
            </div>
          )}
        </div>
      </section>

      {/* Top Collectors Section */}
      {topUsers.length > 0 && (
        <section className="top-collectors-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">🏆 Mejores Coleccionistas</h2>
              <p className="section-subtitle">
                Los usuarios con las colecciones más completas
              </p>
            </div>
            
            <div className="top-collectors">
              {topUsers.map((user, index) => (
                <Card key={user.userId} className="collector-card" hover>
                  <div className="card-body">
                    <div className="collector-rank">
                      <div className="rank-icon">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                      <div className="rank-number">#{user.position}</div>
                    </div>
                    
                    <div className="collector-info">
                      <h4 className="collector-name">{user.username}</h4>
                      <div className="collector-stats">
                        <div className="stat">
                          <span className="stat-value">{user.totalCards}</span>
                          <span className="stat-label">cartas</span>
                        </div>
                        <div className="stat">
                          <span className="stat-value">{user.uniqueCards}</span>
                          <span className="stat-label">únicas</span>
                        </div>
                        <div className="stat">
                          <span className="stat-value">{user.completionPercentage}%</span>
                          <span className="stat-label">completado</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="view-full-ranking">
              <Link to="/ranking" className="btn btn-primary">
                Ver Ranking Completo 📊
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="cta-section">
          <div className="container">
            <Card className="cta-card">
              <div className="card-body">
                <h2>¿Listo para comenzar tu colección?</h2>
                <p>
                  Únete a la comunidad de coleccionistas Pokémon y comienza a gestionar 
                  tus cartas de manera profesional.
                </p>
                <div className="cta-actions">
                  <Link to="/register" className="btn btn-primary btn-lg">
                    🚀 Crear Cuenta Gratis
                  </Link>
                  <Link to="/ranking" className="btn btn-secondary btn-lg">
                    👀 Ver Ranking Público
                  </Link>
                </div>
                
                <div className="cta-features">
                  <div className="cta-feature">
                    <span className="cta-feature-icon">✅</span>
                    <span>Completamente gratuito</span>
                  </div>
                  <div className="cta-feature">
                    <span className="cta-feature-icon">⚡</span>
                    <span>Configuración en segundos</span>
                  </div>
                  <div className="cta-feature">
                    <span className="cta-feature-icon">🔒</span>
                    <span>Tus datos seguros</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Tech Stack Section */}
      <section className="tech-section">
        <div className="container">
          <h2 className="section-title">🛠️ Tecnología</h2>
          <p className="section-subtitle">
            Proyecto académico desarrollado con las mejores prácticas de ingeniería de software
          </p>
          
          <div className="tech-grid">
            <div className="tech-item">
              <div className="tech-icon">⚛️</div>
              <h4>React + TypeScript</h4>
              <p>Frontend moderno y tipado</p>
            </div>
            <div className="tech-item">
              <div className="tech-icon">🟢</div>
              <h4>Node.js + Express</h4>
              <p>Backend robusto y escalable</p>
            </div>
            <div className="tech-item">
              <div className="tech-icon">🗄️</div>
              <h4>SQLite + Prisma</h4>
              <p>Base de datos moderna</p>
            </div>
            <div className="tech-item">
              <div className="tech-icon">🏗️</div>
              <h4>Principios SOLID</h4>
              <p>Arquitectura limpia y mantenible</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;