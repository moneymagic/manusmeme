import React from 'react';
import MainNavigation from './MainNavigation';
import Breadcrumb from './ui/breadcrumb';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0A0B1E] to-[#121225]">
      {/* Header */}
      <MainNavigation />
      
      {/* Main Content */}
      <main className="flex-grow pt-16 pb-24 md:pb-16">
        <div className="premium-container">
          <Breadcrumb />
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Mobile Navigation Spacer */}
      <div className="h-16 md:hidden"></div>
    </div>
  );
};

export default Layout;
