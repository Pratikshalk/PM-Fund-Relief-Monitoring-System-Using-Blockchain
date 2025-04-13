import React from 'react';
import Navbar from './navbar';
import './MainLayout.css'; // Create this file

function MainLayout({ children }) {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;