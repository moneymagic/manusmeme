
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const MLMHeader: React.FC = () => {
  return (
    <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">Matriz Unilevel</h1>
          </div>
          <Badge variant="outline" className="border-green-500 text-green-400">
            Sistema VastCopy
          </Badge>
        </div>
      </div>
    </header>
  );
};

export default MLMHeader;
