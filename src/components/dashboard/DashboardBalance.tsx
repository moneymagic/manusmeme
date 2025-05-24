
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardBalanceProps {
  balance: number;
}

const DashboardBalance: React.FC<DashboardBalanceProps> = ({ balance }) => {
  return (
    <Card className="mb-8 bg-black/30 border-white/10 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-gray-400">Saldo Disponível</p>
            <p className="text-3xl font-bold text-white mt-1">{balance} SOL</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardBalance;
