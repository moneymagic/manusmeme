
import React from "react";
import GrowthChart from "@/components/GrowthChart";
import ActiveOperations from "@/components/ActiveOperations";
import RevenueMetrics from "@/components/RevenueMetrics";
import RankingProgress from "@/components/RankingProgress";
import RequirementsCard from "@/components/dashboard/RequirementsCard";

interface DashboardContentProps {
  isActive: boolean;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ isActive }) => {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Coluna principal */}
      <div className="lg:col-span-2 space-y-8">
        {/* Gráfico de crescimento */}
        <GrowthChart />
        
        {/* Operações ativas */}
        <ActiveOperations />
        
        {/* Métricas de faturamento */}
        <RevenueMetrics />
      </div>

      {/* Coluna lateral */}
      <div className="space-y-8">
        {/* Progresso de Ranking */}
        <RankingProgress />
        
        {/* Requisitos de Saldo */}
        <RequirementsCard isActive={isActive} />
      </div>
    </div>
  );
};

export default DashboardContent;
