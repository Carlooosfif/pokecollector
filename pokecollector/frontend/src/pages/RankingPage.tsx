// src/pages/RankingPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/userService';
import { RankingEntry } from '@/types/user';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';

const RankingPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRanking();
  }, []);

  const loadRanking = async () => {
    try {
      setLoading(true);
      setError('');
      
      const rankingData = await userService.getRanking();
      setRanking(rankingData);
    } catch (err: any) {
      setError(err.message || 'Error cargando el ranking');
    } finally {
      setLoading(false);
    }
  };

  const getRankingIcon = (position: number) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${position}`;
    }
  };

  const getRankingBadgeVariant = (position: number) => {
    switch (position) {
      case 1: return 'warning';
      case 2: return 'secondary';
      case 3: return 'info';
      default: return 'primary';
    }
  };

  const getCompletionBadgeVariant = (percentage: number) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'warning';
    if (percentage >= 25) return 'info';
    return 'secondary';
  };

  const getCurrentUserRank = () => {
    if (!isAuthenticated || !user) return null;
    return ranking.find(entry => entry.userId === user.id);
  };

  const currentUserRank = getCurrentUserRank();

  if (loading) {
    return <LoadingSpinner message="Cargando ranking..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadRanking} />;
  }

  return (
    <div className="ranking-page">
      <div className="container">
        {/* Header */}
        <div className="ranking-header">
          <h1>🏆 Ranking de Coleccionistas</h1>
          <p>Descubre quiénes son los mejores coleccionistas de cartas Pokémon</p>
        </div>

        {/* Estadísticas del usuario actual */}
        {currentUserRank && (
          <Card className="current-user-rank">
            <div className="card-body">
              <h2>Tu Posición en el Ranking</h2>
              <div className="user-rank-details">
                <div className="rank-position">
                  <span className="rank-icon">
                    {getRankingIcon(currentUserRank.position)}
                  </span>
                  <div className="rank-info">
                    <div className="rank-number">Posición #{currentUserRank.position}</div>
                    <div className="rank-username">@{currentUserRank.username}</div>
                  </div>
                </div>
                
                <div className="rank-stats">
                  <div className="stat">
                    <div className="stat-number">{currentUserRank.totalCards}</div>
                    <div className="stat-label">Cartas Totales</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">{currentUserRank.uniqueCards}</div>
                    <div className="stat-label">Cartas Únicas</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">{currentUserRank.completionPercentage}%</div>
                    <div className="stat-label">Completado</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Podio - Top 3 */}
        {ranking.length >= 3 && (
          <div className="podium-section">
            <h2>🎯 Podio de Campeones</h2>
            <div className="podium">
              {/* Segundo lugar */}
              <div className="podium-position second">
                <div className="podium-card">
                  <div className="podium-rank">🥈</div>
                  <div className="podium-user">
                    <div className="user-avatar">👤</div>
                    <div className="user-name">{ranking[1].username}</div>
                  </div>
                  <div className="podium-stats">
                    <Badge variant="secondary">#{ranking[1].position}</Badge>
                    <div className="completion-bar">
                      <div 
                        className="completion-fill"
                        style={{ width: `${ranking[1].completionPercentage}%` }}
                      ></div>
                    </div>
                    <div className="completion-text">
                      {ranking[1].completionPercentage}% completado
                    </div>
                  </div>
                </div>
              </div>

              {/* Primer lugar */}
              <div className="podium-position first">
                <div className="podium-card champion">
                  <div className="podium-rank">🥇</div>
                  <div className="podium-user">
                    <div className="user-avatar champion-avatar">👑</div>
                    <div className="user-name">{ranking[0].username}</div>
                    <Badge variant="warning" size="sm">Campeón</Badge>
                  </div>
                  <div className="podium-stats">
                    <Badge variant="warning">#{ranking[0].position}</Badge>
                    <div className="completion-bar">
                      <div 
                        className="completion-fill champion-fill"
                        style={{ width: `${ranking[0].completionPercentage}%` }}
                      ></div>
                    </div>
                    <div className="completion-text">
                      {ranking[0].completionPercentage}% completado
                    </div>
                  </div>
                </div>
              </div>

              {/* Tercer lugar */}
              <div className="podium-position third">
                <div className="podium-card">
                  <div className="podium-rank">🥉</div>
                  <div className="podium-user">
                    <div className="user-avatar">👤</div>
                    <div className="user-name">{ranking[2].username}</div>
                  </div>
                  <div className="podium-stats">
                    <Badge variant="info">#{ranking[2].position}</Badge>
                    <div className="completion-bar">
                      <div 
                        className="completion-fill"
                        style={{ width: `${ranking[2].completionPercentage}%` }}
                      ></div>
                    </div>
                    <div className="completion-text">
                      {ranking[2].completionPercentage}% completado
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ranking completo */}
        <div className="ranking-section">
          <h2>📊 Ranking Completo</h2>
          
          {ranking.length === 0 ? (
            <Card>
              <div className="card-body text-center">
                <div className="empty-icon">📈</div>
                <h3>No hay datos de ranking</h3>
                <p>Aún no hay usuarios registrados en el sistema.</p>
              </div>
            </Card>
          ) : (
            <div className="ranking-list">
              {ranking.map((entry) => (
                <Card 
                  key={entry.userId} 
                  className={`ranking-item ${currentUserRank?.userId === entry.userId ? 'current-user' : ''}`}
                  hover
                >
                  <div className="card-body">
                    <div className="ranking-item-content">
                      {/* Posición y usuario */}
                      <div className="ranking-position">
                        <div className="position-badge">
                          <Badge variant={getRankingBadgeVariant(entry.position)}>
                            {getRankingIcon(entry.position)}
                          </Badge>
                        </div>
                        <div className="user-info">
                          <div className="username">
                            {entry.username}
                            {currentUserRank?.userId === entry.userId && (
                              <span className="you-indicator">(Tú)</span>
                            )}
                          </div>
                          <div className="user-id">ID: {entry.userId.slice(0, 8)}...</div>
                        </div>
                      </div>

                      {/* Estadísticas */}
                      <div className="ranking-stats">
                        <div className="stat-item">
                          <div className="stat-value">{entry.totalCards}</div>
                          <div className="stat-label">Cartas</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-value">{entry.uniqueCards}</div>
                          <div className="stat-label">Únicas</div>
                        </div>
                        <div className="stat-item">
                          <Badge variant={getCompletionBadgeVariant(entry.completionPercentage)}>
                            {entry.completionPercentage}%
                          </Badge>
                          <div className="stat-label">Completado</div>
                        </div>
                      </div>

                      {/* Barra de progreso */}
                      <div className="progress-section">
                        <div className="progress-bar">
                          <div 
                            className={`progress-fill ${entry.position <= 3 ? 'top-three' : ''}`}
                            style={{ width: `${entry.completionPercentage}%` }}
                          ></div>
                        </div>
                        <div className="progress-text">
                          {entry.completionPercentage}% de la colección completa
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Call to action para usuarios no autenticados */}
        {!isAuthenticated && (
          <Card className="cta-section">
            <div className="card-body text-center">
              <h3>¿Quieres aparecer en el ranking?</h3>
              <p>Crea tu cuenta y comienza a coleccionar cartas Pokémon para competir con otros entrenadores.</p>
              <div className="cta-buttons">
                <a href="/register" className="btn btn-primary">
                  Crear Cuenta
                </a>
                <a href="/login" className="btn btn-secondary">
                  Iniciar Sesión
                </a>
              </div>
            </div>
          </Card>
        )}

        {/* Información adicional */}
        <Card className="ranking-info">
          <div className="card-body">
            <h3>ℹ️ Cómo funciona el ranking</h3>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon">🎯</div>
                <div className="info-content">
                  <h4>Criterio de ordenamiento</h4>
                  <p>Los usuarios se ordenan por porcentaje de completación y luego por cartas únicas.</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">📈</div>
                <div className="info-content">
                  <h4>Actualización</h4>
                  <p>El ranking se actualiza en tiempo real cada vez que agregas o quitas cartas.</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">🏆</div>
                <div className="info-content">
                  <h4>Competencia</h4>
                  <p>¡Compite con otros coleccionistas para llegar al primer puesto!</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RankingPage;