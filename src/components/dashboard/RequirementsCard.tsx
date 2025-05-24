
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

interface RequirementsCardProps {
  isActive: boolean;
}

const RequirementsCard: React.FC<RequirementsCardProps> = ({ isActive }) => {
  return (
    <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Requisitos de Saldo</CardTitle>
        <CardDescription className="text-gray-400">
          Mantenha seu saldo para continuar ativo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Saldo para Ativação:</span>
          <span className="text-green-400 font-medium">0.5 SOL</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Saldo de Manutenção:</span>
          <span className="text-yellow-400 font-medium">0.1 SOL</span>
        </div>
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg mt-2">
          <p className="text-green-300 text-sm">
            {isActive 
              ? "Sua conta está ativa e funcionando corretamente" 
              : "Sua conta está inativa. Adicione saldo para ativá-la."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequirementsCard;
