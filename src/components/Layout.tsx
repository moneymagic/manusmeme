import React from 'react';
import { MainNavigation } from './MainNavigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Gerar breadcrumbs baseado no caminho atual
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(path => path);
    
    if (paths.length === 0) return null;
    
    const breadcrumbs = [
      { path: '/', label: 'Home' },
      ...paths.map((path, index) => {
        const url = `/${paths.slice(0, index + 1).join('/')}`;
        // Formatar o label para exibição (capitalizar e substituir hífens por espaços)
        const label = path
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        return { path: url, label };
      })
    ];
    
    return (
      <Breadcrumb className="mb-4">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            <BreadcrumbItem>
              <BreadcrumbLink href={crumb.path} className={index === breadcrumbs.length - 1 ? 'text-white font-medium' : 'text-gray-400'}>
                {crumb.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator className="text-gray-500" />}
          </React.Fragment>
        ))}
      </Breadcrumb>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="sticky top-0 z-10 border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <MainNavigation />
        </div>
      </div>
      <main className="container mx-auto px-4 sm:px-6 py-6">
        {location.pathname !== '/' && generateBreadcrumbs()}
        {children}
      </main>
      <footer className="border-t border-white/10 backdrop-blur-sm bg-black/20 py-4 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} MemeFlow. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
