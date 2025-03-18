import React from 'react';
import NavBar from '../components/NavBar';

const MainLayout = ({ children }) => {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-gray-100 pt-16">
        {children}
      </main>
    </>
  );
};

export default MainLayout;