
import React from 'react';
import { MainNavigation } from './MainNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-6 py-4">
          <MainNavigation />
        </div>
      </div>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
