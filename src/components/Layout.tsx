import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ModeToggle } from './ModeToggle';
import { Button } from "@/components/ui/button"
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '@/config/authConfig';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';

const Layout: React.FC = () => {
  const { instance, accounts } = useMsal();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const handleLogout = () => {
    console.log("MS Logout")
    instance.logoutRedirect({
      postLogoutRedirectUri: "/",
    });
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(prev => !prev)
  }

  const renderSideBar = () => {
    return (
      <div className={`position z-50 fixed right-43 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <Sidebar toggleDrawer={toggleDrawer} />
      </div>

    );
  };

  return (
    <div className="flex h-screen bg-background text-foreground ">
      <div className="hidden md:block">
        <Sidebar toggleDrawer={toggleDrawer} />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="p-4 bg-secondary lg:flex justify-between items-center items-end md:flex  ">
          <div className='hidden md:block'></div>
          <div className=" flex items-center justify-between space-x-4">
            <button
              className="block md:hidden p-2 focus:outline-none"
              onClick={toggleDrawer}>
              <HamburgerMenuIcon className="w-6 h-6" />
            </button>
            <span >👋🏻 Welcome, {accounts?.[0]?.name || "John"} </span>
            <Button variant="outline" onClick={handleLogout} className="hidden sm:block">Logout</Button>
            <div className='hidden sm:block'>
              <ModeToggle />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-0 lg:p-2 ">
          <Outlet />
        </main>
      </div>
      {isDrawerOpen && renderSideBar()}
    </div>
  );
};

export default Layout;