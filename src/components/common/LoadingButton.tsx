import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  spinnerColor?: 'white' | 'primary' | 'muted';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  loadingText,
  spinnerColor = 'white',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={isLoading || disabled}
      aria-busy={isLoading}
      className={`relative inline-flex items-center justify-center gap-2 transition-all select-none disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" color={spinnerColor} />
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};
