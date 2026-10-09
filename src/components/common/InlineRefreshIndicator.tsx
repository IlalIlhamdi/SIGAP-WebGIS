import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export interface InlineRefreshIndicatorProps {
  isRefreshing: boolean;
  label?: string;
  className?: string;
}

export const InlineRefreshIndicator: React.FC<InlineRefreshIndicatorProps> = ({
  isRefreshing,
  label = 'Memperbarui data...',
  className = ''
}) => {
  if (!isRefreshing) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E8F5E9] border border-[#B9DFC5] text-xs font-bold text-[#0D653A] animate-in fade-in duration-200 select-none shadow-xs ${className}`}
    >
      <LoadingSpinner size="xs" color="primary" />
      <span>{label}</span>
    </div>
  );
};
