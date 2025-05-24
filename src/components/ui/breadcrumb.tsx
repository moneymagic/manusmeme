import React from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ className = '' }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(segment => segment);
  
  // Format path segment to be more readable
  const formatSegment = (segment: string) => {
    // Convert kebab-case or snake_case to Title Case with spaces
    return segment
      .replace(/-|_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Generate breadcrumb items
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    ...pathSegments.map((segment, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
      return {
        name: formatSegment(segment),
        path
      };
    })
  ];
  
  if (breadcrumbItems.length <= 1) {
    return null; // Don't show breadcrumbs on home page
  }
  
  return (
    <nav className={`premium-fade-in py-4 ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={item.path} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              )}
              
              {isLast ? (
                <span className="text-white font-medium">{item.name}</span>
              ) : (
                <a 
                  href={item.path}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {item.name}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
