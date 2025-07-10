// src/components/common/ErrorMessage.tsx
import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="error-container">
      <div className="alert alert-error">
        <div className="error-content">
          <h3>⚠️ Error</h3>
          <p>{message}</p>
          {onRetry && (
            <button onClick={onRetry} className="btn btn-primary btn-sm mt-4">
              Intentar nuevamente
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
