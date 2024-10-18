import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ModeToggle } from './mode-toggle';
import { Button } from "@/components/ui/button"
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="p-4 bg-secondary flex justify-between items-center">
          <ModeToggle />
          <div className="flex items-center space-x-4">
            <span>👋🏻 Welcome, {user?.name}! </span>
            <Button variant="outline" onClick={logout}>Logout</Button>
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