import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Target, History, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { icon: LayoutGrid, label: 'Abyss', path: '/' },
    { icon: Target, label: 'Targets', path: '/targets' },
    { icon: History, label: 'Ledger', path: '/ledger' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen pb-24">
      <header className="p-6 flex justify-between items-center sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-sm" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Wallet Watch</h1>
        </div>
        <div className="flex gap-4">
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <div className="w-2 h-2 bg-primary rounded-full absolute" />
            <Settings className="w-6 h-6 text-text-secondary" />
          </button>
        </div>
      </header>

      <main className="px-6 max-w-2xl mx-auto">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-xl border-t border-white/5 px-6 py-4 z-20">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 transition-colors",
                  isActive ? "text-primary" : "text-text-secondary hover:text-white"
                )}
              >
                <item.icon className={cn("w-6 h-6", isActive && "fill-primary/20")} />
                <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
