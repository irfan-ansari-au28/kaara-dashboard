import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ModeToggle } from './ModeToggle';
import { Button } from "@/components/ui/button"
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '@/config/authConfig';

const Layout: React.FC = () => {
  const { instance, accounts } = useMsal();

  const handleLogout = () => {
    console.log("MS Logout")
    instance.logoutRedirect({
      postLogoutRedirectUri: "/",
    });
  };


  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="p-4 bg-secondary flex justify-between items-center">
          <div></div>
          <div className="flex items-center justify-between space-x-4">
            <span>👋🏻 Welcome, {accounts?.[0]?.name || "John"} </span>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
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