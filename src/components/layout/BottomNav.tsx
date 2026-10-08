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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E3EAE5] px-3 py-2 pb-safe shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          if (tab.isPrimary) {
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) => `
                  relative -top-4 flex flex-col items-center group
                `}
              >
                <div className="w-13 h-13 rounded-full bg-[#16834B] text-white flex items-center justify-center shadow-lg shadow-[#16834B]/30 border-4 border-white active:scale-95 transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-[#16834B] mt-0.5">{tab.label}</span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) => `
                flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all
                ${isActive 
                  ? 'text-[#16834B] font-bold' 
                  : 'text-[#66766C] hover:text-[#25352D] font-medium'}
              `}
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1 rounded-full ${isActive ? 'bg-[#E8F5E9]' : ''}`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#16834B]' : 'text-[#66766C]'}`} />
                  </div>
                  <span className="text-[10px] tracking-tight">{tab.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
