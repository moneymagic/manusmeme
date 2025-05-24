
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

const NetworkVisualizationCard: React.FC = () => {
  return (
    <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Matriz de Ganhos</CardTitle>
        <CardDescription className="text-gray-400">
          Profundidade Infinita + Compressão por Ranking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-full inline-block mb-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <p className="text-white font-bold">Você</p>
          <p className="text-gray-400 text-sm">Master Account</p>
        </div>
        <div className="bg-white/5 p-4 rounded-lg text-sm text-gray-300">
          <p className="mb-2">O sistema sobe linha por linha da árvore, procurando os ranks qualificados de V1 a V8.</p>
          <p>Cada rank tem um percentual fixo dentro dos 20% distribuídos em rede.</p>
        </div>
        <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
          Ver Árvore Completa
        </Button>
      </CardContent>
    </Card>
  );
};

export default NetworkVisualizationCard;
