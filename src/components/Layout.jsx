import React from 'react';
import AppNavbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
        <AppNavbar />
        <main className="main-content">
            <Outlet />
        </main>
        <footer className="text-center py-4 mt-5 text-muted border-top">
            <div className="container">
                <small>&copy; 2026 Business tools. Excelência em Gestão.</small>
                <br />
                <small>Criado por Denner Figueiredo (Migrated to React)</small>
            </div>
        </footer>
    </>
  );
};

export default Layout;
