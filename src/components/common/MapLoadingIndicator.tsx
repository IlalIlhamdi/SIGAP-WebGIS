import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export interface MapLoadingIndicatorProps {
  isLoading: boolean;
  label?: string;
  className?: string;
}

export const MapLoadingIndicator: React.FC<MapLoadingIndicatorProps> = ({
  isLoading,
  label = 'Memuat layer geospasial…',
  className = ''
}) => {
  if (!isLoading) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`absolute top-3 left-1/2 -translate-x-1/2 z-25 pointer-events-none select-none transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${className}`}
    >
      <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#B9DFC5] shadow-md flex items-center gap-2 text-xs font-bold text-[#0D653A]">
        <LoadingSpinner size="xs" color="primary" />
        <span>{label}</span>
      </div>
    </div>
  );
};
