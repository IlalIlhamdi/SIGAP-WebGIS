import React from 'react';

export interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'muted';
  label?: string;
  className?: string;
  inline?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  label,
  className = '',
  inline = false,
}) => {
  const sizeClasses = {
    xs: 'w-3.5 h-3.5 border-2',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2.5',
    lg: 'w-8 h-8 border-3',
  };

  const colorClasses = {
    primary: 'border-[#16834B] border-t-transparent',
    white: 'border-white border-t-transparent',
    muted: 'border-slate-400 border-t-transparent',
  };

  const labelColorClasses = {
    primary: 'text-[#0D653A]',
    white: 'text-white',
    muted: 'text-[#66766C]',
  };

  return (
    <div
      role="status"
      className={`${inline ? 'inline-flex' : 'flex'} items-center justify-center gap-2 select-none ${className}`}
    >
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin shrink-0`}
        aria-hidden="true"
      />
      {label ? (
        <span className={`text-xs font-semibold ${labelColorClasses[color]}`}>
          {label}
        </span>
      ) : (
        <span className="sr-only">Memuat...</span>
      )}
    </div>
  );
};
