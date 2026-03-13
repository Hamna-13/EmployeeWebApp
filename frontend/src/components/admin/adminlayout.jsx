import React from 'react';
import AdminHeader from './adminheader';

import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-100">
      <AdminHeader />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
