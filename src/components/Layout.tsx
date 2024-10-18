import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ModeToggle } from './mode-toggle';
import { Button } from "@/components/ui/button"
import { useAuth } from '@/hooks/useAuth';

const Layout: React.FC = () => {
  const { user, loading, login, logout } = useAuth();

  const handleAuth = async () => {
    if (user) {
      await logout();
    } else {
      await login();
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="p-4 bg-secondary flex justify-between items-center">
          <div></div>
          <div className="flex items-center justify-between space-x-4">
            <span>👋🏻 Welcome, {user?.name} </span>
            <Button variant="outline" onClick={handleAuth}>Logout</Button>
            <ModeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;