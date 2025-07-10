import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md' 
}) => {
  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass = {
    sm: 'modal-sm',
    md: 'modal-md',
    lg: 'modal-lg'
  }[size];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal-content ${sizeClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="card-header">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button 
                onClick={onClose}
                className="btn btn-secondary btn-sm"
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        <div className="card-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;