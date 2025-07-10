import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md' 
}) => {
  const baseClasses = 'badge';
  const variantClass = `badge-${variant}`;
  const sizeClass = `badge-${size}`;

  return (
    <span className={`${baseClasses} ${variantClass} ${sizeClass}`}>
      {children}
    </span>
  );
};

export default Badge;
