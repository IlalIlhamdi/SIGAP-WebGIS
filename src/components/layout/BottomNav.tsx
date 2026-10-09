import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, PlusCircle, ShieldAlert, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const tabs = [
    { to: '/dashboard', label: 'Beranda', icon: LayoutDashboard },
    { to: '/map', label: 'Peta', icon: Map },
    { to: '/reports/new', label: 'Lapor', icon: PlusCircle, isPrimary: true },
    { to: '/evacuation', label: 'Evakuasi', icon: ShieldAlert },
    { to: '/profile', label: 'Profil', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E3EAE5] px-1 sm:px-2 pt-1 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-lg">
      <div className="grid grid-cols-5 w-full max-w-md mx-auto items-end">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          if (tab.isPrimary) {
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className="relative -top-2.5 flex flex-col items-center justify-center min-h-[48px] w-full group py-0.5"
                aria-label={tab.label}
              >
                <div className="w-12 h-12 rounded-full bg-[#16834B] text-white flex items-center justify-center shadow-lg shadow-[#16834B]/30 border-[3px] border-white active:scale-95 transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-[#16834B] mt-0.5 leading-tight">{tab.label}</span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) => `
                flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all min-h-[48px] w-full
                ${isActive 
                  ? 'text-[#16834B] font-bold' 
                  : 'text-[#66766C] hover:text-[#25352D] font-medium'}
              `}
              aria-label={tab.label}
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1 rounded-full ${isActive ? 'bg-[#E8F5E9]' : ''}`}>
                    <Icon className={`w-[22px] h-[22px] ${isActive ? 'text-[#16834B]' : 'text-[#66766C]'}`} />
                  </div>
                  <span className="text-[11px] sm:text-xs tracking-tight leading-tight mt-0.5">{tab.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
