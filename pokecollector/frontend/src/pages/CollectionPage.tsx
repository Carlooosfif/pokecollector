import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { cardService } from '@/services/cardService';
import { albumService } from '@/services/albumService';
import { userService } from '@/services/userService';
import { UserCard } from '@/types/card';
import { Card } from '@/types/card';
import { Album } from '@/types/album';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Badge from '@/components/common/Badge';
import CardComponent from '@/components/common/Card';

const CollectionPage: React.FC = () => {
  const { user } = useAuth();
  const [userCards, setUserCards] = useState<UserCard[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [availableCards, setAvailableCards] = useState<Card[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para filtros y búsqueda
  const [selectedAlbum, setSelectedAlbum] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rarity' | 'number'>('number');

  // Estados para modales
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [selectedCardToAdd, setSelectedCardToAdd] = useState<Card | null>(null);
  const [cardToRemove, setCardToRemove] = useState<UserCard | null>(null);

  // Estados para la cantidad en el modal
  const [quantityToAdd, setQuantityToAdd] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [userCardsData, albumsData, userStatsData] = await Promise.all([
        cardService.getUserCollection(),
        albumService.getAllAlbums(),
        userService.getUserStats()
      ]);

      setUserCards(userCardsData);
      setAlbums(albumsData);
      setUserStats(userStatsData);

      // Cargar todas las cartas disponibles para el modal de agregar
      const allCards = await cardService.getAllCards();
      setAvailableCards(allCards);

    } catch (err: any) {
      setError(err.message || 'Error cargando la colección');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar cartas basado en álbum seleccionado y término de búsqueda
  const filteredUserCards = userCards.filter(userCard => {
    const matchesAlbum = selectedAlbum === 'all' || userCard.card.albumId === selectedAlbum;
    const matchesSearch = userCard.card.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAlbum && matchesSearch;
  });

  // Ordenar cartas
  const sortedUserCards = [...filteredUserCards].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.card.name.localeCompare(b.card.name);
      case 'rarity':
        const rarityOrder = { 'COMMON': 1, 'UNCOMMON': 2, 'RARE': 3, 'HOLO': 4, 'LEGENDARY': 5 };
        return (rarityOrder[b.card.rarity] || 0) - (rarityOrder[a.card.rarity] || 0);
      case 'number':
      default:
        return a.card.number - b.card.number;
    }
  });

  // Obtener cartas que el usuario no tiene para el modal
  const cardsNotInCollection = availableCards.filter(card => 
    !userCards.some(userCard => userCard.cardId === card.id)
  );

  const handleAddCard = async () => {
    if (!selectedCardToAdd) return;

    try {
      await cardService.addCardToCollection({
        cardId: selectedCardToAdd.id,
        quantity: quantityToAdd
      });

      // Recargar datos
      await loadData();

      // Cerrar modal y resetear
      setShowAddCardModal(false);
      setSelectedCardToAdd(null);
      setQuantityToAdd(1);
    } catch (err: any) {
      setError(err.message || 'Error agregando carta');
    }
  };

  const handleRemoveCard = async () => {
    if (!cardToRemove) return;

    try {
      await cardService.removeCardFromCollection(cardToRemove.cardId);
      
      // Recargar datos
      await loadData();
      
      // Cerrar modal
      setCardToRemove(null);
    } catch (err: any) {
      setError(err.message || 'Error eliminando carta');
    }
  };

  const handleUpdateQuantity = async (userCardId: string, newQuantity: number) => {
    try {
      await cardService.updateCardQuantity(userCardId, newQuantity);
      
      // Actualizar localmente
      setUserCards(prev => prev.map(uc => 
        uc.id === userCardId ? { ...uc, quantity: newQuantity } : uc
      ));

      // Recargar estadísticas
      const newStats = await userService.getUserStats();
      setUserStats(newStats);
    } catch (err: any) {
      setError(err.message || 'Error actualizando cantidad');
    }
  };

  const getRarityBadgeVariant = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY': return 'warning';
      case 'HOLO': return 'info';
      case 'RARE': return 'success';
      case 'UNCOMMON': return 'primary';
      case 'COMMON': return 'secondary';
      default: return 'secondary';
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando tu colección..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadData} />;
  }

  return (
    <div className="collection-page">
      <div className="container">
        {/* Header con estadísticas */}
        <div className="collection-header">
          <div className="collection-title">
            <h1>Mi Colección</h1>
            <p>Bienvenido, {user?.username}! 👋</p>
          </div>
          
          {userStats && (
            <div className="collection-stats">
              <div className="stat-card">
                <div className="stat-number">{userStats.totalCards}</div>
                <div className="stat-label">Cartas Totales</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{userStats.uniqueCards}</div>
                <div className="stat-label">Cartas Únicas</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{userStats.completionPercentage}%</div>
                <div className="stat-label">Completado</div>
              </div>
            </div>
          )}
        </div>

        {/* Controles de filtro y búsqueda */}
        <div className="collection-controls">
          <div className="controls-left">
            <div className="form-group">
              <label className="form-label">Buscar:</label>
              <input
                type="text"
                className="form-input"
                placeholder="Nombre de la carta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Álbum:</label>
              <select
                className="form-select"
                value={selectedAlbum}
                onChange={(e) => setSelectedAlbum(e.target.value)}
              >
                <option value="all">Todos los álbumes</option>
                {albums.map(album => (
                  <option key={album.id} value={album.id}>
                    {album.name} (Gen {album.generation})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Ordenar por:</label>
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="number">Número</option>
                <option value="name">Nombre</option>
                <option value="rarity">Rareza</option>
              </select>
            </div>
          </div>

          <div className="controls-right">
            <button
              onClick={() => setShowAddCardModal(true)}
              className="btn btn-primary"
            >
              ➕ Agregar Carta
            </button>
          </div>
        </div>

        {/* Lista de cartas */}
        {sortedUserCards.length === 0 ? (
          <div className="empty-collection">
            <div className="empty-icon">📦</div>
            <h3>Tu colección está vacía</h3>
            <p>¡Comienza agregando algunas cartas a tu colección!</p>
            <button
              onClick={() => setShowAddCardModal(true)}
              className="btn btn-primary"
            >
              Agregar Primera Carta
            </button>
          </div>
        ) : (
          <div className="cards-grid">
            {sortedUserCards.map(userCard => (
              <CardComponent key={userCard.id} className="card-item" hover>
                <div className="card-body">
                  <div className="card-image">
                    {userCard.card.imageUrl ? (
                      <img 
                        src={userCard.card.imageUrl} 
                        alt={userCard.card.name}
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-card.png';
                        }}
                      />
                    ) : (
                      <div className="card-placeholder">
                        <span>#{userCard.card.number.toString().padStart(3, '0')}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="card-info">
                    <div className="card-header-info">
                      <h3 className="card-name">{userCard.card.name}</h3>
                      <Badge variant={getRarityBadgeVariant(userCard.card.rarity)}>
                        {userCard.card.rarity}
                      </Badge>
                    </div>
                    
                    <div className="card-details">
                      <p className="card-number">#{userCard.card.number.toString().padStart(3, '0')}</p>
                      {userCard.card.type && (
                        <p className="card-type">Tipo: {userCard.card.type}</p>
                      )}
                      <p className="card-album">
                        {userCard.card.album?.name} (Gen {userCard.card.album?.generation})
                      </p>
                    </div>

                    <div className="card-actions">
                      <div className="quantity-controls">
                        <button
                          onClick={() => handleUpdateQuantity(userCard.id, userCard.quantity - 1)}
                          className="btn btn-secondary btn-sm"
                          disabled={userCard.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="quantity-display">x{userCard.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(userCard.id, userCard.quantity + 1)}
                          className="btn btn-secondary btn-sm"
                          disabled={userCard.quantity >= 99}
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        onClick={() => setCardToRemove(userCard)}
                        className="btn btn-danger btn-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </CardComponent>
            ))}
          </div>
        )}

        {/* Modal para agregar carta */}
        <Modal
          isOpen={showAddCardModal}
          onClose={() => setShowAddCardModal(false)}
          title="Agregar Carta a la Colección"
          size="lg"
        >
          <div className="add-card-modal">
            {cardsNotInCollection.length === 0 ? (
              <div className="text-center">
                <p>¡Felicidades! Ya tienes todas las cartas disponibles en tu colección.</p>
              </div>
            ) : (
              <>
                <div className="available-cards-grid">
                  {cardsNotInCollection.map(card => (
                    <div
                      key={card.id}
                      className={`available-card ${selectedCardToAdd?.id === card.id ? 'selected' : ''}`}
                      onClick={() => setSelectedCardToAdd(card)}
                    >
                      <div className="available-card-image">
                        {card.imageUrl ? (
                          <img src={card.imageUrl} alt={card.name} />
                        ) : (
                          <div className="card-placeholder">
                            <span>#{card.number.toString().padStart(3, '0')}</span>
                          </div>
                        )}
                      </div>
                      <div className="available-card-info">
                        <h4>{card.name}</h4>
                        <Badge variant={getRarityBadgeVariant(card.rarity)} size="sm">
                          {card.rarity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedCardToAdd && (
                  <div className="selected-card-actions">
                    <div className="form-group">
                      <label className="form-label">Cantidad:</label>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={quantityToAdd}
                        onChange={(e) => setQuantityToAdd(Number(e.target.value))}
                        className="form-input"
                        style={{ width: '100px' }}
                      />
                    </div>
                    <button
                      onClick={handleAddCard}
                      className="btn btn-primary"
                    >
                      Agregar a Colección
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </Modal>

        {/* Dialog de confirmación para eliminar */}
        <ConfirmDialog
          isOpen={!!cardToRemove}
          onClose={() => setCardToRemove(null)}
          onConfirm={handleRemoveCard}
          title="Eliminar Carta"
          message={`¿Estás seguro de que quieres eliminar "${cardToRemove?.card.name}" de tu colección?`}
          confirmText="Eliminar"
          variant="danger"
        />
      </div>
    </div>
  );
};

export default CollectionPage;