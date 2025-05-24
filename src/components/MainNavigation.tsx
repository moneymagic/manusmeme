import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, BarChart2, Image, Settings, Menu } from 'lucide-react';
import { useState } from 'react';

const MainNavigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Assets', path: '/assets', icon: <Wallet className="h-5 w-5" /> },
    { name: 'Copy Trading', path: '/copy-trade', icon: <BarChart2 className="h-5 w-5" /> },
    { name: 'NFTs', path: '/nfts', icon: <Image className="h-5 w-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-5 w-5" /> },
  ];
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="premium-nav hidden md:flex">
        <div className="flex-1 flex items-center">
          <Link to="/" className="flex items-center mr-6">
            <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
            <span className="ml-2 text-white font-bold text-lg">Manusmeme</span>
          </Link>
          
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`premium-nav-item ${isActive(item.path) ? 'active' : ''}`}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="flex items-center">
          <button className="premium-button-secondary">
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </button>
        </div>
      </nav>
      
      {/* Mobile Navigation */}
      <nav className="premium-nav md:hidden">
        <div className="flex-1 flex items-center">
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
            <span className="ml-2 text-white font-bold text-lg">Manusmeme</span>
          </Link>
        </div>
        
        <button 
          className="premium-button-icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </nav>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="premium-card-glass fixed top-16 left-0 right-0 z-50 premium-fade-in">
          <div className="flex flex-col p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center p-3 rounded-md ${
                  isActive(item.path) 
                    ? 'bg-accent-primary text-white' 
                    : 'text-gray-300 hover:bg-white/10'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
            
            <button className="premium-button-primary mt-4">
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </button>
          </div>
        </div>
      )}
      
      {/* Bottom Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/10 md:hidden z-40">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-3 px-2 ${
                isActive(item.path) 
                  ? 'text-accent-primary' 
                  : 'text-gray-400'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default MainNavigation;
