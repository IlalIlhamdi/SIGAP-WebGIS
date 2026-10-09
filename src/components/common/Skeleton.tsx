import React from 'react';
import { Compass } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  className?: string;
}

/**
 * Base primitive skeleton with subtle greenish neutral tint and smooth shimmer.
 * Fully decorative with aria-hidden="true".
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  className = '',
  ...props
}) => {
  const variantStyles = {
    text: 'h-4 rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-[#E2EBE5] ${variantStyles[variant]} ${className}`}
      {...props}
    >
      <div 
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer pointer-events-none" 
      />
    </div>
  );
};

/**
 * Metric Card Skeleton matching the exact height and layout of the 5 cards in DashboardPage.
 */
export const MetricCardSkeleton: React.FC<{ borderLeftColor?: string; className?: string }> = ({
  borderLeftColor = 'border-l-slate-300',
  className = ''
}) => {
  return (
    <div 
      aria-hidden="true"
      className={`card-farm p-3.5 sm:p-4 space-y-1.5 border-l-4 ${borderLeftColor} ${className}`}
    >
      <Skeleton className="h-3.5 w-24 rounded" />
      <Skeleton className="h-8 w-16 rounded-lg my-1" />
      <Skeleton className="h-3.5 w-32 rounded" />
    </div>
  );
};

/**
 * List Card Skeleton for facilities, evacuation points, reports, and data sources.
 */
export const ListCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div 
      aria-hidden="true"
      className={`card-farm p-5 space-y-3.5 flex flex-col justify-between ${className}`}
    >
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
        <Skeleton className="h-5 w-3/4 rounded-md" />
        <div className="space-y-1.5 pt-1">
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-5/6 rounded" />
        </div>
      </div>
      <div className="pt-2 border-t border-[#E3EAE5] flex items-center justify-between">
        <Skeleton className="h-3 w-28 rounded" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
};

/**
 * Weather Widget Skeleton matching the exact dimension and internal layout of WeatherWidget.
 */
export const WeatherWidgetSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div 
      aria-hidden="true"
      className={`card-farm md:col-span-2 overflow-hidden border border-[#B9DFC5] shadow-md bg-white ${className}`}
    >
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-[#E3EAE5] flex flex-wrap items-center justify-between gap-2 bg-[#F9FAF9]">
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-9 h-9 rounded-xl" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-36 rounded" />
            <Skeleton className="h-3 w-48 rounded" />
          </div>
        </div>
        <div className="flex gap-1.5">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>

      {/* Hero Snapshot */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-[#0F3826] via-[#124E33] to-[#0A301E] relative overflow-hidden space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-28 rounded-lg bg-white/25" />
              <Skeleton className="h-4 w-40 rounded bg-white/20" />
              <Skeleton className="h-3 w-32 rounded bg-white/15" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 bg-black/20 p-3 sm:p-4 rounded-2xl border border-white/10">
            <div className="px-2 space-y-1 text-center">
              <Skeleton className="h-3 w-14 mx-auto rounded bg-white/20" />
              <Skeleton className="h-6 w-10 mx-auto rounded bg-white/30" />
            </div>
            <div className="px-2 space-y-1 text-center border-x border-white/15">
              <Skeleton className="h-3 w-14 mx-auto rounded bg-white/20" />
              <Skeleton className="h-6 w-10 mx-auto rounded bg-white/30" />
            </div>
            <div className="px-2 space-y-1 text-center">
              <Skeleton className="h-3 w-14 mx-auto rounded bg-white/20" />
              <Skeleton className="h-6 w-10 mx-auto rounded bg-white/30" />
            </div>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-white/10 border border-white/15">
          <Skeleton className="h-4 w-3/4 rounded bg-white/20" />
        </div>
      </div>

      {/* Forecast timeline grid */}
      <div className="p-4 sm:p-5 bg-white space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3.5 w-44 rounded" />
          <Skeleton className="h-3 w-32 rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-[#F8FAF9] p-3 rounded-2xl border border-[#E2E8F0] space-y-2 text-center">
              <Skeleton className="h-3 w-16 mx-auto rounded" />
              <Skeleton className="h-6 w-12 mx-auto rounded" />
              <Skeleton className="h-3.5 w-20 mx-auto rounded" />
              <Skeleton className="h-2.5 w-14 mx-auto rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Chart Skeleton for HazardDistributionChart & FloodEventsChart.
 */
export const ChartSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div 
      aria-hidden="true"
      className={`card-farm p-5 space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-4 w-44 rounded" />
          <Skeleton className="h-3 w-32 rounded" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Chart visualization dummy bars */}
      <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2 border-b border-[#E3EAE5]">
        <Skeleton className="w-full h-1/3 rounded-t-lg" />
        <Skeleton className="w-full h-3/5 rounded-t-lg" />
        <Skeleton className="w-full h-4/5 rounded-t-lg" />
        <Skeleton className="w-full h-1/2 rounded-t-lg" />
        <Skeleton className="w-full h-2/3 rounded-t-lg" />
      </div>

      <div className="flex items-center justify-center gap-4 pt-1">
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-3 w-20 rounded-full" />
      </div>
    </div>
  );
};

/**
 * Area Detail Skeleton for AreaDetailPage without blanking navigation or contacts.
 */
export const AreaDetailSkeleton: React.FC = () => {
  return (
    <div aria-hidden="true" className="space-y-6 animate-in fade-in duration-150">
      {/* Hero Area Banner Skeleton */}
      <div className="card-farm p-6 sm:p-8 space-y-4 bg-gradient-to-br from-[#16834B]/90 to-[#0D653A]/90 border-0">
        <div className="space-y-2">
          <Skeleton className="h-3 w-28 rounded-full bg-white/20" />
          <Skeleton className="h-8 w-64 rounded-lg bg-white/30" />
          <Skeleton className="h-4 w-80 rounded bg-white/20" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-white/10 p-3 rounded-xl space-y-1.5 border border-white/10">
              <Skeleton className="h-3 w-16 rounded bg-white/20" />
              <Skeleton className="h-5 w-20 rounded bg-white/30" />
            </div>
          ))}
        </div>
      </div>

      {/* Map box placeholder */}
      <div className="card-farm p-4 space-y-3">
        <Skeleton className="h-4 w-40 rounded" />
        <div className="h-72 rounded-2xl bg-[#E2EBE5] flex items-center justify-center">
          <LoadingSpinner size="md" color="primary" label="Menyiapkan peta spasial..." />
        </div>
      </div>

      {/* 2-column detail sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-farm p-5 space-y-3">
          <Skeleton className="h-4 w-36 rounded" />
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="card-farm p-5 space-y-3">
          <Skeleton className="h-4 w-36 rounded" />
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Placeholder box for Leaflet map before MapContainer is mounted.
 */
export const MapPlaceholder: React.FC<{ heightClass?: string; label?: string }> = ({
  heightClass = 'h-[calc(100vh-140px)]',
  label = 'Menyiapkan peta…'
}) => {
  return (
    <div 
      role="status"
      aria-label="Peta sedang dimuat"
      className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-[#E3EAE5] bg-[#E5EBE6] flex flex-col items-center justify-center select-none shadow-xs`}
    >
      <div className="flex flex-col items-center gap-3 p-6 bg-white/90 backdrop-blur-md rounded-2xl border border-[#B9DFC5] shadow-lg text-center max-w-xs mx-4">
        <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#16834B] flex items-center justify-center">
          <Compass className="w-6 h-6 animate-pulse text-[#0D653A]" />
        </div>
        <div>
          <h4 className="font-extrabold text-sm text-[#0D653A]">{label}</h4>
          <p className="text-[11px] text-[#66766C] mt-0.5">Memuat koordinat spasial Aceh Utara</p>
        </div>
        <LoadingSpinner size="sm" color="primary" />
      </div>
    </div>
  );
};

/**
 * Clean full-page skeleton fallback for React.lazy() route transitions.
 */
export const PageFallback: React.FC = () => {
  return (
    <div aria-hidden="true" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
      <Skeleton className="h-80 w-full rounded-2xl" />
    </div>
  );
};
