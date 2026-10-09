import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Header } from './Header';
import { StatusBanner } from './StatusBanner';
import { LocationCheckerModal } from '../map/LocationCheckerModal';
import { registerBackButtonHandler } from '../../lib/native/back-button';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Close location modal on Android hardware back button
  useEffect(() => {
    if (isLocationModalOpen) {
      return registerBackButtonHandler(() => {
        setIsLocationModalOpen(false);
        return true;
      }, 20);
    }
  }, [isLocationModalOpen]);

  return (
    <div className="min-h-screen min-h-dvh bg-[#F4F7F5] flex flex-col antialiased text-[#25352D]">
      <div className="flex flex-1 min-h-0">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area: Padding bottom accounts for bottom nav + raised Lapor button + safe area */}
        <div className="flex-1 flex flex-col min-w-0 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
          <Header onOpenLocationCheck={() => setIsLocationModalOpen(true)} />
          <StatusBanner />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Location Checker Modal */}
      <LocationCheckerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
};
