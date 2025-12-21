import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <main className="max-w-screen-sm mx-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};
