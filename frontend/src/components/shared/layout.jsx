import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import Header from './header';

export default function Layout({ sidebarItems, bottomLinks }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className={`fixed z-40 inset-y-0 left-0 w-60 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        sm:translate-x-0 sm:static sm:inset-0`}
      >
        <Sidebar
          onClose={() => setIsSidebarOpen(false)}
          links={sidebarItems}
          bottomLinks={bottomLinks}
        />
      </div>

      <div className="flex flex-col flex-1 overflow-auto bg-neutral-100">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
