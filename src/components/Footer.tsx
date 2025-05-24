import React from 'react';

interface FooterProps {}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-black/30 backdrop-blur-sm border-t border-white/5 py-4">
      <div className="premium-container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img src="/logo.svg" alt="Logo" className="h-6 w-6" />
            <span className="ml-2 text-white font-medium">Manusmeme</span>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Support
            </a>
          </div>
          
          <div className="mt-4 md:mt-0">
            <p className="text-gray-400 text-sm">© 2025 Manusmeme. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
