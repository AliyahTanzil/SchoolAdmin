import React from 'react';

export default function LoadingButton({ 
  children, 
  onClick, 
  loading = false, 
  disabled = false, 
  variant = 'primary', 
  fullWidth = false, 
  className = '' 
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`loading-button loading-button-${variant} ${fullWidth ? 'loading-button-full' : ''} ${className}`}
    >
      {loading ? (
        <span className="loading-spinner">
          <span className="spinner"></span>
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
