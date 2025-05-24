
import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

interface ReferralCardProps {
  directReferrals: number;
}

const ReferralCard: React.FC<ReferralCardProps> = ({ directReferrals }) => {
  return (
    <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <p className="text-white">Programa de Indicação</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-gray-400 text-sm">Seu código de indicação:</p>
          <div className="bg-white/5 p-3 rounded border border-white/20">
            <p className="text-white font-mono">MASTER2024</p>
          </div>
        </div>
        <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0">
          Copiar Link
        </Button>
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Você tem <span className="text-white font-bold">{directReferrals}</span> indicações diretas
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralCard;
