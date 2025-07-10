import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Cargando...', 
  size = 'md' 
}) => {
  const sizeClass = {
    sm: 'loading-spinner-sm',
    md: 'loading-spinner',
    lg: 'loading-spinner-lg'
  }[size];

  return (
    <div className="loading-container">
      <div className={sizeClass}></div>
      {message && <p className="text-secondary">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
