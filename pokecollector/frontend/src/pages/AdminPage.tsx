import React, { useState, useEffect } from 'react';
import { albumService } from '@/services/albumService';
import { cardService } from '@/services/cardService';
import { userService } from '@/services/userService';
import { Album } from '@/types/album';
import { Card, CreateCardRequest } from '@/types/card';
import { CreateAlbumRequest } from '@/types/album';
import { User } from '@/types/user';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Badge from '@/components/common/Badge';
import CardComponent from '@/components/common/Card'

const AdminPage: React.FC = () => {
  // Estados principales
  const [albums, setAlbums] = useState<Album[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para sección activa
  const [activeSection, setActiveSection] = useState<'albums' | 'cards' | 'users'>('albums');

  // Estados para modales de álbumes
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [albumToDelete, setAlbumToDelete] = useState<Album | null>(null);

  // Estados para modales de cartas
  const [showCardModal, setShowCardModal] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [cardToDelete, setCardToDelete] = useState<Card | null>(null);

  // Estados para formularios
  const [albumForm, setAlbumForm] = useState<CreateAlbumRequest>({
    name: '',
    description: '',
    generation: 1,
    imageUrl: ''
  });

  const [cardForm, setCardForm] = useState<CreateCardRequest>({
    name: '',
    number: 1,
    rarity: 'COMMON',
    type: '',
    albumId: '',
    imageUrl: '',
    description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [albumsData, cardsData, usersData] = await Promise.all([
        albumService.getAllAlbums(),
        cardService.getAllCards(),
        userService.getAllUsers()
      ]);

      setAlbums(albumsData);
      setCards(cardsData);
      setUsers(usersData);
    } catch (err: any) {
      setError(err.message || 'Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  // ==================== GESTIÓN DE ÁLBUMES ====================

  const handleCreateAlbum = () => {
    setEditingAlbum(null);
    setAlbumForm({
      name: '',
      description: '',
      generation: 1,
      imageUrl: ''
    });
    setShowAlbumModal(true);
  };

  const handleEditAlbum = (album: Album) => {
    setEditingAlbum(album);
    setAlbumForm({
      name: album.name,
      description: album.description || '',
      generation: album.generation,
      imageUrl: album.imageUrl || ''
    });
    setShowAlbumModal(true);
  };

  const handleSaveAlbum = async () => {
    try {
      if (editingAlbum) {
        await albumService.updateAlbum(editingAlbum.id, albumForm);
      } else {
        await albumService.createAlbum(albumForm);
      }
      
      await loadData();
      setShowAlbumModal(false);
    } catch (err: any) {
      setError(err.message || 'Error guardando álbum');
    }
  };

  const handleDeleteAlbum = async () => {
    if (!albumToDelete) return;

    try {
      await albumService.deleteAlbum(albumToDelete.id);
      await loadData();
      setAlbumToDelete(null);
    } catch (err: any) {
      setError(err.message || 'Error eliminando álbum');
    }
  };

  // ==================== GESTIÓN DE CARTAS ====================

  const handleCreateCard = () => {
    setEditingCard(null);
    setCardForm({
      name: '',
      number: 1,
      rarity: 'COMMON',
      type: '',
      albumId: albums.length > 0 ? albums[0].id : '',
      imageUrl: '',
      description: ''
    });
    setShowCardModal(true);
  };

  const handleEditCard = (card: Card) => {
    setEditingCard(card);
    setCardForm({
      name: card.name,
      number: card.number,
      rarity: card.rarity,
      type: card.type || '',
      albumId: card.albumId,
      imageUrl: card.imageUrl || '',
      description: card.description || ''
    });
    setShowCardModal(true);
  };

  const handleSaveCard = async () => {
    try {
      if (editingCard) {
        await cardService.updateCard(editingCard.id, cardForm);
      } else {
        await cardService.createCard(cardForm);
      }
      
      await loadData();
      setShowCardModal(false);
    } catch (err: any) {
      setError(err.message || 'Error guardando carta');
    }
  };

  const handleDeleteCard = async () => {
    if (!cardToDelete) return;

    try {
      await cardService.deleteCard(cardToDelete.id);
      await loadData();
      setCardToDelete(null);
    } catch (err: any) {
      setError(err.message || 'Error eliminando carta');
    }
  };

  // ==================== UTILIDADES ====================

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

  const getCardsByAlbum = (albumId: string) => {
    return cards.filter(card => card.albumId === albumId);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando panel de administración..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadData} />;
  }

  return (
    <div className="admin-page">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <h1>⚙️ Panel de Administración</h1>
          <p>Gestiona álbumes, cartas y usuarios del sistema</p>
        </div>

        {/* Navigation */}
        <div className="admin-nav">
          <button
            onClick={() => setActiveSection('albums')}
            className={`btn ${activeSection === 'albums' ? 'btn-primary' : 'btn-secondary'}`}
          >
            📚 Álbumes ({albums.length})
          </button>
          <button
            onClick={() => setActiveSection('cards')}
            className={`btn ${activeSection === 'cards' ? 'btn-primary' : 'btn-secondary'}`}
          >
            🃏 Cartas ({cards.length})
          </button>
          <button
            onClick={() => setActiveSection('users')}
            className={`btn ${activeSection === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          >
            👥 Usuarios ({users.length})
          </button>
        </div>

        {/* Sección de Álbumes */}
        {activeSection === 'albums' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Gestión de Álbumes</h2>
              <button onClick={handleCreateAlbum} className="btn btn-primary">
                ➕ Crear Álbum
              </button>
            </div>

            <div className="albums-grid">
              {albums.map(album => (
                <CardComponent key={album.id} className="album-card" hover>
                  <div className="card-body">
                    <div className="album-info">
                      <h3>{album.name}</h3>
                      <p className="album-description">{album.description}</p>
                      <div className="album-details">
                        <Badge variant="info">Generación {album.generation}</Badge>
                        <Badge variant="secondary">{album.totalCards} cartas</Badge>
                      </div>
                    </div>
                    
                    <div className="album-actions">
                      <button
                        onClick={() => handleEditAlbum(album)}
                        className="btn btn-secondary btn-sm"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => setAlbumToDelete(album)}
                        className="btn btn-danger btn-sm"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </CardComponent>
              ))}

              {albums.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">📚</div>
                  <h3>No hay álbumes</h3>
                  <p>Crea el primer álbum para comenzar.</p>
                  <button onClick={handleCreateAlbum} className="btn btn-primary">
                    Crear Primer Álbum
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sección de Cartas */}
        {activeSection === 'cards' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Gestión de Cartas</h2>
              <button 
                onClick={handleCreateCard} 
                className="btn btn-primary"
                disabled={albums.length === 0}
              >
                ➕ Crear Carta
              </button>
            </div>

            {albums.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>Primero crea un álbum</h3>
                <p>Necesitas al menos un álbum antes de poder crear cartas.</p>
              </div>
            ) : (
              <div className="cards-grid">
                {cards.map(card => (
                  <CardComponent key={card.id} className="card-item" hover>
                    <div className="card-body">
                      <div className="card-image">
                        {card.imageUrl ? (
                          <img src={card.imageUrl} alt={card.name} />
                        ) : (
                          <div className="card-placeholder">
                            <span>#{card.number.toString().padStart(3, '0')}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="card-info">
                        <h3>{card.name}</h3>
                        <div className="card-details">
                          <p>#{card.number} - {card.type}</p>
                          <Badge variant={getRarityBadgeVariant(card.rarity)}>
                            {card.rarity}
                          </Badge>
                        </div>
                        <p className="card-album">
                          {albums.find(a => a.id === card.albumId)?.name}
                        </p>
                      </div>

                      <div className="card-actions">
                        <button
                          onClick={() => handleEditCard(card)}
                          className="btn btn-secondary btn-sm"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => setCardToDelete(card)}
                          className="btn btn-danger btn-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </CardComponent>
                ))}

                {cards.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-icon">🃏</div>
                    <h3>No hay cartas</h3>
                    <p>Crea la primera carta para el álbum.</p>
                    <button onClick={handleCreateCard} className="btn btn-primary">
                      Crear Primera Carta
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Sección de Usuarios */}
        {activeSection === 'users' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Gestión de Usuarios</h2>
            </div>

            <div className="users-table">
              {users.map(user => (
                <CardComponent key={user.id} className="user-row" hover>
                  <div className="card-body">
                    <div className="user-info">
                      <div className="user-details">
                        <h3>{user.username}</h3>
                        <p>{user.email}</p>
                        <p className="user-id">ID: {user.id}</p>
                      </div>
                      <div className="user-role">
                        <Badge variant={user.role === 'ADMIN' ? 'warning' : 'primary'}>
                          {user.role}
                        </Badge>
                      </div>
                      <div className="user-dates">
                        <p className="text-sm text-secondary">
                          Registrado: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardComponent>
              ))}

              {users.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">👥</div>
                  <h3>No hay usuarios</h3>
                  <p>No se encontraron usuarios en el sistema.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal de Álbum */}
        <Modal
          isOpen={showAlbumModal}
          onClose={() => setShowAlbumModal(false)}
          title={editingAlbum ? 'Editar Álbum' : 'Crear Álbum'}
        >
          <form onSubmit={(e) => { e.preventDefault(); handleSaveAlbum(); }}>
            <div className="form-group">
              <label className="form-label">Nombre *</label>
              <input
                type="text"
                className="form-input"
                value={albumForm.name}
                onChange={(e) => setAlbumForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-textarea"
                value={albumForm.description}
                onChange={(e) => setAlbumForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Generación *</label>
              <select
                className="form-select"
                value={albumForm.generation}
                onChange={(e) => setAlbumForm(prev => ({ ...prev, generation: Number(e.target.value) }))}
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(gen => (
                  <option key={gen} value={gen}>Generación {gen}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">URL de imagen</label>
              <input
                type="url"
                className="form-input"
                value={albumForm.imageUrl}
                onChange={(e) => setAlbumForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="modal-actions">
              <button type="button" onClick={() => setShowAlbumModal(false)} className="btn btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                {editingAlbum ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Modal de Carta */}
        <Modal
          isOpen={showCardModal}
          onClose={() => setShowCardModal(false)}
          title={editingCard ? 'Editar Carta' : 'Crear Carta'}
        >
          <form onSubmit={(e) => { e.preventDefault(); handleSaveCard(); }}>
            <div className="form-group">
              <label className="form-label">Nombre *</label>
              <input
                type="text"
                className="form-input"
                value={cardForm.name}
                onChange={(e) => setCardForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Número *</label>
              <input
                type="number"
                className="form-input"
                min="1"
                max="999"
                value={cardForm.number}
                onChange={(e) => setCardForm(prev => ({ ...prev, number: Number(e.target.value) }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rareza *</label>
              <select
                className="form-select"
                value={cardForm.rarity}
                onChange={(e) => setCardForm(prev => ({ ...prev, rarity: e.target.value as any }))}
                required
              >
                <option value="COMMON">Común</option>
                <option value="UNCOMMON">Poco común</option>
                <option value="RARE">Rara</option>
                <option value="HOLO">Holográfica</option>
                <option value="LEGENDARY">Legendaria</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tipo</label>
              <input
                type="text"
                className="form-input"
                value={cardForm.type}
                onChange={(e) => setCardForm(prev => ({ ...prev, type: e.target.value }))}
                placeholder="Fuego, Agua, Planta..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Álbum *</label>
              <select
                className="form-select"
                value={cardForm.albumId}
                onChange={(e) => setCardForm(prev => ({ ...prev, albumId: e.target.value }))}
                required
              >
                {albums.map(album => (
                  <option key={album.id} value={album.id}>
                    {album.name} (Gen {album.generation})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">URL de imagen</label>
              <input
                type="url"
                className="form-input"
                value={cardForm.imageUrl}
                onChange={(e) => setCardForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-textarea"
                value={cardForm.description}
                onChange={(e) => setCardForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="modal-actions">
              <button type="button" onClick={() => setShowCardModal(false)} className="btn btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                {editingCard ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Diálogos de confirmación */}
        <ConfirmDialog
          isOpen={!!albumToDelete}
          onClose={() => setAlbumToDelete(null)}
          onConfirm={handleDeleteAlbum}
          title="Eliminar Álbum"
          message={`¿Estás seguro de que quieres eliminar el álbum "${albumToDelete?.name}"? Esto también eliminará todas las cartas asociadas.`}
          confirmText="Eliminar"
          variant="danger"
        />

        <ConfirmDialog
          isOpen={!!cardToDelete}
          onClose={() => setCardToDelete(null)}
          onConfirm={handleDeleteCard}
          title="Eliminar Carta"
          message={`¿Estás seguro de que quieres eliminar la carta "${cardToDelete?.name}"?`}
          confirmText="Eliminar"
          variant="danger"
        />
      </div>
    </div>
  );
};

export default AdminPage;