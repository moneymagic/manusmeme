import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Home, Network, Copy, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MainNavigation() {
  const location = useLocation();
  const isMobile = useIsMobile();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/network', label: 'Network', icon: Network },
    { path: '/copy-trade', label: 'Copy Trading', icon: Copy },
    { path: '/wallet', label: 'Wallet', icon: Wallet },
  ];

  return (
    <nav className="flex items-center justify-between px-2 py-1 bg-black/30 backdrop-blur-sm rounded-full border border-white/10">
      <div className="flex items-center space-x-1">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Button
              variant={isActive(item.path) ? "default" : "ghost"}
              size={isMobile ? "sm" : "default"}
              className={`rounded-full transition-all ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <item.icon className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4 mr-2'}`} />
              {!isMobile && <span>{item.label}</span>}
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  );
}
